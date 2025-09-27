"use client";

import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function InterviewResult({
  resultData,
  hideStartNew = false,
  onStartNew,
}) {
  if (!resultData) return null;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tighter text-transparent bg-clip-text pb-2 gradient">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Interview Results
      </h1>

      <Card className="bg-transparent text-white">
        <CardContent className="space-y-6">
          {/* Improvement Tip */}
          {resultData.improvementTip && (
            <div className="bg-gray-200 text-black p-4 rounded-lg">
              <p className="font-bold text-xl">Improvement Tip:</p>
              <p className="text-lg">{resultData.improvementTip}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-medium text-xl">Question Review</h3>
            {resultData.questions.map((q, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 space-y-2 bg-black text-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-lg">
                    Q{idx + 1}: {q.question}
                  </p>
                  {q.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                </div>

                <div className="text-sm text-white">
                  <p>
                    <strong>Your Answer:</strong> {q.userAnswer}
                  </p>
                  {!q.isCorrect && (
                    <p>
                      <strong>Correct Answer:</strong> {q.idealAnswer}
                    </p>
                  )}
                </div>

                {q.feedback && (
                  <div className="p-2 rounded bg-white font-bold text-blue-900 text-sm">
                    <p className="font-black">Feedback:</p>
                    <p>{q.feedback}</p>
                  </div>
                )}

                {q.explanation && (
                  <div className="p-2 rounded bg-gray-200 text-black text-sm">
                    <p className="font-medium">Explanation:</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>

        {!hideStartNew && (
          <CardFooter>
            <Button onClick={onStartNew} className="w-full">
              Start New Interview
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
