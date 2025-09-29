"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
      project: latestForm.project,
      experience: latestForm.experience,
      skills: latestForm.skills || [],
      numQuestions: latestForm.numQuestions,
    };
  }

  const prompt = `You are an expert professional interviewer.
Conduct a ${form.type} mock interview with ${form.numQuestions} basic and advance questions for a ${form.industry} project (${form.project}) professional${
    form.skills.length ? ` with expertise in ${form.skills.join(", ")}` : ""
  }.
  if ${form.numQuestions} > 9 can also include small coding question mention in question to code.
 Follow a 60:40 ratio:

60% skill-based fundamentals questions (directly from ${form.skills}).

40% project-based questions (focused on ${form.project}).

If ${form.type} = "behavioral", ask questions in an HR-style interview format, focusing on real-world workplace scenarios (teamwork, conflict resolution, leadership, problem-solving).

The first question must always be: “Tell me about yourself.”

Phrase every question as if you are the interviewer speaking directly to the candidate.

For each question, also include a  ‘idealAnswer’ (like a candidate’s strong, natural response — concise but realistic).
  Return the response in this JSON format only, no extra text:
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
