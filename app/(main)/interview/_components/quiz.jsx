"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import { BarLoader } from "react-spinners";
import QuizResult from "./quiz-result";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import z from "zod";

const interviewFormSchema = z.object({
  industry: z.string().min(1, "Industry is required"),
  experience: z.coerce
    .number({ invalid_type_error: "Experience must be a number" })
    .min(0, "Experience cannot be negative"),
  skills: z
    .string()
    .min(1, "Skills are required")
    .transform((val) => val.split(",").map((s) => s.trim())),
  numQuestions: z.coerce
    .number({ invalid_type_error: "Number of questions must be a number" })
    .min(1, "Must have at least 1 question"),
});
export default function QuizWithForm() {
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "technical",
    industry: "",
    experience: 0,
    skills: "",
    numQuestions: 10,
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
   const [errors, setErrors] = useState({});
  const [quizReady, setQuizReady] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
      setQuizReady(true);
    }
  }, [quizData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmitForm = async () => {
    try {
  // Validate raw inputs

  interviewFormSchema.parse(formData);


  const payload = {
    ...formData,
    skills: formData.skills.split(",").map((s) => s.trim()), // only transform skills
  };
      const res = await fetch("/api/interviewForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit form");

      toast.success("Form submitted! Generating quiz...");
      setFormOpen(false);
      await generateQuizFn(payload);
    } catch (err) {
      console.error(err);
      toast.error( "Fill all Field");
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) correct++;
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (err) {
      toast.error(err.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setQuizReady(false);
    setResultData(null);
    setFormOpen(true);
  };

  // Show form dialog
  if (formOpen) {
    return (
      <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 z-50 bg-black shadow-lg text-white">
        <CardHeader>
          <CardTitle>Fill Interview Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
              className="w-full border border-white bg-white text-black font-semibold rounded-xl mt-2 pl-2"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full rounded-xl mt-2"
              required
            />
             {errors.industry && (
          <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
        )}
          </div>
          <div>
            <Label htmlFor="experience">Experience (years)</Label>
            <Input
              id="experience"
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full rounded-xl mt-2"
            />
          </div>
          {formData.type === "technical" && (
            <div>
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. React, Next.js, TypeScript"
                className="w-full rounded-xl mt-2"
              />
            </div>
          )}
          <div>
            <Label htmlFor="numQuestions">Number of Questions</Label>
            <Input
              id="numQuestions"
              type="number"
              name="numQuestions"
              value={formData.numQuestions}
              onChange={handleChange}
              className="w-full rounded-xl mt-2"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => setFormOpen(false)}
            variant="outline"
            className={"text-black"}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmitForm} disabled={generatingQuiz}>
            {generatingQuiz ? "Processing..." : "Submit & Generate Quiz"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Show quiz result
  if (resultData) {
    return <QuizResult result={resultData} onStartNew={startNewQuiz} />;
  }

  // Show loader while generating quiz
  if (generatingQuiz) {
    return <BarLoader className="mt-4" width="100%" color="gray" />;
  }

  // Show quiz
  if (quizReady && quizData) {
    const question = quizData[currentQuestion];
    return (
      <Card className="mx-2 bg-black">
        <CardHeader>
          <CardTitle className="text-white">
            Question {currentQuestion + 1} of {quizData.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-white">
          <p className="text-lg font-medium">{question.question}</p>
          <RadioGroup
            onValueChange={handleAnswer}
            value={answers[currentQuestion]}
            className="space-y-2"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  disabled={showExplanation}
                  className="data-[state=checked]:bg-white"
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>

          {showExplanation && (
            <div className="mt-4 p-4 rounded-lg">
              <p className="font-medium">Explanation:</p>
              <p className="text-muted-foreground">{question.explanation}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!showExplanation && (
            <Button
              onClick={() => setShowExplanation(true)}
              variant="outline"
              disabled={!answers[currentQuestion]}
            >
              Show Explanation
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion] || savingResult}
            className="ml-auto"
          >
            {savingResult
              ? "Saving..."
              : currentQuestion < quizData.length - 1
              ? "Next Question"
              : "Finish Quiz"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-2 bg-black">
      <CardHeader>
        <CardTitle className={"text-white font-bold text-2xl"}>
          Ready to test your knowledge?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This quiz contains 10 questions specific to your industry and skills.
          Take your time and choose the best answer for each question.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setFormOpen(true)}>Start Quiz</Button>
      </CardFooter>
    </Card>
  );
}

