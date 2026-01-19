"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Step 1: Generate mock interview questions
 */
export async function generateMockInterview(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Use formData if passed, else fallback to last interviewForm
  let form;
  if (formData) {
    form = formData;
  } else {
    const latestForm = await db.interviewForm.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    if (!latestForm) throw new Error("No interview form found");
    form = {
      type: latestForm.type,
      industry: latestForm.industry || "",
      role: latestForm.role || "",
      project: latestForm.project,
      experience: latestForm.experience,
      skills: latestForm.skills || [],
      numQuestions: latestForm.numQuestions,
    };
  }

  const prompt = `You are a highly experienced professional interviewer with expertise in conducting real-world interviews.

Generate a ${form.type} mock interview with ${form.numQuestions} realistic and challenging questions for a ${form.industry} role: ${form.role}.  
The candidate has ${form.experience} years of professional experience, has worked on a project (${form.project}), ${
  form.skills.length
    ? `and possesses strong skills in ${form.skills.join(", ")}.`
    : ""
}

---

### 🎯 Objective
You must generate realistic, conversational interview questions and corresponding ideal answers based on the provided form data.

---

### 🧩 Rules & Structure

#### 1. Interview Type Rules
- If ${form.type} = **"behavioral"**:
  - Ask **HR-style, real-world** questions testing communication, teamwork, leadership, adaptability, decision-making, and conflict resolution.
  - The **first question must always be:** “Tell me about yourself.”

- If ${form.type} = **"technical"**:
  - Ask **only technical questions** related to ${form.skills}, ${form.role}, and ${form.industry}.
  - Then, follow the **Question Composition** rule below.
  -The **first question must always be:** “Tell me about yourself.”
- If ${form.type} = **"coding"**:
  - Ask **only coding questions** (no theory or HR). from ${form.skills}.
  - Do **not** include “Tell me about yourself,” behavioral, or project-based questions.

---

#### 2. Question Composition
- If ${form.project} is provided and not an empty string (""):
  - Maintain a **70:30 ratio**:
    - 70% skill-based or fundamental questions derived from ${form.skills}, ${form.role}, and ${form.industry}.
    - 30% project-based or scenario-driven questions focused on ${form.project}.
- Else:
  - Ask **only** skill-based or fundamental questions derived from ${form.skills}, ${form.role}, and ${form.industry}.

---

#### 3. Question Count Rules
- If ${form.numQuestions} > 9:
  - Include **1–2 simple short coding or problem-solving questions**.
  - These must clearly state: “Please write or explain your approach to…”

---

#### 4. Tone & Style
- Questions must sound **natural, professional, and conversational** — like an actual interviewer.
- Avoid robotic, repetitive, or exam-style phrasing.
- Maintain logical flow and engagement throughout the interview.

---

#### 5. Answer Quality
- For every question, generate an "idealAnswer" that reflects a **strong, concise, and realistic** response from a well-prepared candidate.
- Answers should be **clear, relevant, and specific** to the question.

---

#### 6. Output Format
- Return **only valid JSON**, with no extra commentary, explanations, or markdown.
- Follow this exact format:

{
  "questions": [
    {
      "question": "string",
      "idealAnswer": "string"
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const mock = JSON.parse(cleanedText);

    return mock.questions;
  } catch (error) {
    console.error("Error generating mock interview:", error);
    throw new Error("Failed to generate mock interview questions");
  }
}

export async function saveMockInterviewResult(questions, userAnswers) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // Evaluate responses
  const evaluated = questions.map((q, idx) => ({
    question: q.question,
    idealAnswer: q.idealAnswer,
    userAnswer: userAnswers[idx] || "",
  }));

  const feedbackPrompt = `
  The candidate answered the following mock interview questions:

  ${evaluated
    .map(
      (q, i) => `
      Q${i + 1}: ${q.question}
      Ideal Answer: ${q.idealAnswer}
      Candidate Answer: ${q.userAnswer}
      `
    )
    .join("\n\n")}

  Task:
  - Provide short, specific feedback for each answer (1–2 sentences).
  - Suggest ONE overall improvement tip (max 5 sentences) based on Communication,Technical Skills,Problem Solving.
  - Evaluate if the answer is correct or not with boolean value;
  - Give score of 100;
  
  Return strictly in JSON format:
  {
    "feedback": ["string", "string", ...],
    "improvementTip": "string"
    " isCorrect: boolen"
    "interviewscore:number"
  }
  `;

  let feedbackData = { feedback: [], improvementTip: null };
  try {
    const feedbackResult = await model.generateContent(feedbackPrompt);
    const text = feedbackResult.response.text();
    const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
    feedbackData = JSON.parse(cleaned);
  } catch (error) {
    console.error("Error generating feedback:", error);
  }

  // Attach feedback to answers
  const finalResults = evaluated.map((q, i) => ({
    ...q,
    feedback: feedbackData.feedback?.[i] || null,
    isCorrect: feedbackData.isCorrect?.[i] || false,
  }));

  try {
    const assessment = await db.mockInterviewAssessment.create({
      data: {
        userId: user.id,
        questions: finalResults,
        category: "Mock Interview",
        improvementTip: feedbackData.improvementTip,
        interviewscore: feedbackData.interviewscore,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving mock interview result:", error);
    throw new Error("Failed to save mock interview result");
  }
}

/**
 * Step 3: Get all mock interview assessments
 */
export async function getMockInterviews() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    return await db.mockInterviewAssessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching mock interviews:", error);
    throw new Error("Failed to fetch mock interview results");
  }
}
