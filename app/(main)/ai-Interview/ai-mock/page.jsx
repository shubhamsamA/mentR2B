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
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import z from "zod";
import {
  generateMockInterview,
  saveMockInterviewResult,
} from "@/actions/mockInterview";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import InterviewResult from "../_components/interview-result";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function MockInterview() {
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "technical",
    industry: "",
    role: "",
    project: "",
    experience: 0,
    skills: "",
    numQuestions: 5,
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizReady, setQuizReady] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateMockInterviewFn,
    data: quizData,
  } = useFetch(generateMockInterview);

  const {
    loading: savingResult,
    fn: saveMockInterviewResultFn,
    data: resultData, // ✅ comes from useFetch
    setData: setResultData, // ✅ to reset on new interview
  } = useFetch(saveMockInterviewResult);

  const [showWebcam, setShowWebcam] = useState(false);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(""));
      setQuizReady(true);
    }
  }, [quizData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async () => {
    try {
      interviewFormSchema.parse(formData);
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      };

      const res = await fetch("/api/interviewForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit form");

      toast.success("Form submitted! Generating mock interview...");
      await generateMockInterviewFn(payload);
      setFormOpen(false);
    } catch {
      toast.error("Fill all fields correctly");
    }
  };

  const startNewInterview = () => {
    setFormOpen(true);
    setQuizReady(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setResultData(null);
  };

  const QuestionCard = ({ question, questionIndex, onAnswer, onNext }) => {
    const {
      results,
      startSpeechToText,
      stopSpeechToText,
      isRecording,
      error: speechError,
    } = useSpeechToText({
      continuous: true,
      timeout: 10000,
    });

    // Local state for typed + speech answer
    const [answer, setAnswer] = useState("");

    // Keep speech-to-text in sync
    useEffect(() => {
      if (results.length > 0) {
        setAnswer(results.join(" "));
      }
    }, [results]);
    return (
      <div className="flex justify-center items-start min-h-screen ">
        <div className="flex flex-col w-full max-w-5xl mt-20">
          <p className="text-center font-bold text-sm text-red-500 mb-4">
            Remember: This is for practice purposes only, don’t cheat.
          </p>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Question */}
            <Card className="flex-1 bg-black text-white ">
              <CardHeader>
                <CardTitle>
                  Question {questionIndex + 1} of {quizData.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{question.question}</p>
              </CardContent>
            </Card>

            {/* Answer */}
            <Card className="flex-1 bg-black text-white">
              <CardHeader>
                <CardTitle>Your Answer</CardTitle>
              </CardHeader>
              <CardContent>
                {speechError && <p>Speech recognition not supported 🤷‍</p>}

                {/* Webcam feed */}
                {showWebcam && (
                  <Webcam className="w-full max-w-md h-64 rounded border" />
                )}
                <Button
                  variant="outline"
                  className={"bg-black mr-2"}
                  onClick={() => setShowWebcam((v) => !v)}
                >
                  {showWebcam ? "Hide Webcam" : "Show Webcam"}
                </Button>

                <Button
                  variant="outline"
                  onClick={isRecording ? stopSpeechToText : startSpeechToText}
                  className="my-2 bg-black"
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                <p className="mt-2 text-sm text-red-500">
                  ⚠️ Use the text field only if your answer contains code.
                </p>
                {/* Editable textarea */}
                <textarea
                  className="w-full p-2 border rounded bg-black min-h-[120px] text-white"
                  placeholder="Type your answer here or use speech-to-text..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => {
                    onAnswer(answer);
                    onNext(answer);
                  }}
                  disabled={savingResult}
                >
                  {questionIndex < quizData.length - 1
                    ? "Next Question"
                    : "Finish Interview"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  };

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
                <SelectItem value="coding">Coding</SelectItem>
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
            />
          </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="about the role"
                  className="w-full rounded-xl mt-2"
                />   
              </div>

          <div>
            <Label htmlFor="project">Projects</Label>
            <Input
              id="project"
              name="project"
              value={formData.project}
              onChange={handleChange}
              placeholder="Projects & internship"
              className="w-full rounded-xl mt-2"
            />
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
          <div>
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Next.js"
              className="w-full rounded-xl mt-2"
            />
          </div>
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
            className="text-black"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmitForm} disabled={generatingQuiz}>
            {generatingQuiz ? "Processing..." : "Submit & Start"}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  const router = useRouter();
  // --- LOADING ---
  if (generatingQuiz) return <BarLoader width="100%" color="gray-200" />;
  if (resultData) {
    if (resultData) {
      return (
        <div className="flex justify-center items-center min-h-screen px-2">
          <Button
            variant={"ghost"}
            onClick={() => router.push("/ai-Interview")}
            className="absolute top-8 left-8 text-white flex"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back to Interview overview
          </Button>
          <InterviewResult
            resultData={resultData}
            onStartNew={startNewInterview}
          />
        </div>
      );
    }
  }

  // --- QUIZ ---
  if (quizReady && quizData) {
    return (
      <QuestionCard
        key={currentQuestion}
        question={quizData[currentQuestion]}
        questionIndex={currentQuestion}
        onAnswer={(answer) => {
          const newAnswers = [...answers];
          newAnswers[currentQuestion] = answer;
          setAnswers(newAnswers);
        }}
        onNext={(lastAnswer) => {
          const newAnswers = [...answers];
          newAnswers[currentQuestion] = lastAnswer;

          if (currentQuestion < quizData.length - 1) {
            setAnswers(newAnswers);
            setCurrentQuestion(currentQuestion + 1);
          } else {
            saveMockInterviewResultFn(quizData, newAnswers).catch((err) =>
              toast.error(err.message || "Failed to save results")
            );
          }
        }}
      />
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-2">
      <Button
        variant={"ghost"}
        onClick={() => router.push("/ai-Interview")}
        className="absolute top-8 left-8 text-white flex"
      >
        <ArrowLeft className="h-6 w-6 mr-2" />
        Back to Interview overview
      </Button>

      <Card className="mx-2 bg-black text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Ready for your mock interview?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This mock interview generates questions based on your industry,
            Projects and skills. Answer using your voice.
          </p>
          <p className="mt-2 text-sm font-bold text-red-500">
            ⚠️ This is for practice purposes only, don’t cheat.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={startNewInterview}>Start Interview</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
