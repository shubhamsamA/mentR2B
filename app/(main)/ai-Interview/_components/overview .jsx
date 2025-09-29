"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import InterviewResult from "./interview-result";

export default function Overview({ mockAssessments }) {
  const router = useRouter();
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const averageScore = () => {
    if (!mockAssessments?.length) return 0;
    const total = mockAssessments.reduce(
      (sum, assessment) => sum + assessment.interviewscore,
      0
    );
    return (total / mockAssessments.length).toFixed(1);
  };

  const totalQuestions = () => {
    if (!mockAssessments?.length) return 0;
    return mockAssessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  const totalCorrect = () => {
    if (!mockAssessments?.length) return 0;
    return mockAssessments.reduce((sum, assessment) => {
      const correctAnswers = assessment.questions.filter(
        (q) => q.isCorrect
      ).length;
      return sum + correctAnswers;
    }, 0);
  };

  const latestscore = () => {
    if (!mockAssessments?.length) return 0;
    return mockAssessments[0].interviewscore.toFixed(1);
  };

  useEffect(() => {
    if (mockAssessments) {
      const formattedData = mockAssessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd HH:mm"),
        score: assessment.interviewscore,
      }));
      setChartData(formattedData);
    }
  }, [mockAssessments]);

  return (
    <div className="m-3">
      <div className="space-y-6 mb-10">
        <Card className="border-2 bg-transparent">
          <CardHeader className=" pb-2 flex items-center justify-between mb-2 w-full">
            <CardTitle className="text-2xl md:text-5xl font-bold gradient tracking-tighter text-transparent bg-clip-text pb-2 ">
              Overall Performance
            </CardTitle>
            <Button 
              onClick={() => router.push("/ai-Interview/ai-mock")}
              className={"hover:cursor-pointer  tracking-tighter"}
            >
              Start New Interview
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className={`text-4xl font-bold text-white`}>
                {averageScore()}%
                <div className="text-2xl text-muted-foreground">
                  AverageScore{" "}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-white">
                    {" "}
                    {totalQuestions()}
                  </div>
                  <div className="text-md text-muted-foreground">
                    Total Questions{" "}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-white">
                    {totalCorrect()}
                  </div>
                  <div className="text-md text-muted-foreground">
                    total correct question
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-white">
                    {latestscore()}
                  </div>
                  <div className="text-md text-muted-foreground">
                    Latest test score
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mb-10">
        <Card className={"bg-black "}>
          <CardHeader>
            <CardTitle className="font-bold gradient tracking-tighter text-transparent bg-clip-text pb-2 text-3xl md:text-4xl">
              Performance Trend
            </CardTitle>
            <CardDescription>Your quiz scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap={20}>
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="date" interval={0} tick={{ fill: "white" }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    cursor={false} // disables hover highlight behind bars
                    content={({ active, payload, label }) => {
                      if (active && payload?.length) {
                        const point = payload[0].payload;
                        return (
                          <div className="border rounded-lg p-2 shadow-md bg-white">
                            <p className="text-sm font-medium">
                              Score: {point.score}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {point.date}
                            </p>
                          </div>
                        );
                      }
                      return null; // hide tooltip when not hovering
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="#8884d8"
                    barSize={40}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <>
          <Card className={"bg-black"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="gradient  tracking-tighter  text-transparent bg-clip-text pb-2 text-3xl md:text-4xl">
                    Recent Mock Interviews
                  </CardTitle>
                  <CardDescription>
                    Review your past quiz performance
                  </CardDescription>
                </div>
                <Button
                  onClick={() => router.push("/ai-Interview/ai-mock")}
                  className={"hover:cursor-pointer"}
                >
                  Start New Interview
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 bg-black">
                {mockAssessments?.map((assessment, i) => (
                  <Card
                    key={assessment.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors bg-black"
                    onClick={() => setSelectedInterview(assessment)}
                  >
                    <CardHeader>
                      <CardTitle className="gradient  tracking-tighter  text-transparent bg-clip-text pb-2 text-2xl">
                        INTERVIEW {mockAssessments.length - i}
                      </CardTitle>
                      <CardDescription className="flex justify-between w-full text-white">
                        <div>
                          Score: {assessment.interviewscore.toFixed(1)}%
                        </div>
                        <div>
                          {format(
                            new Date(assessment.createdAt),
                            "MMMM dd, yyyy"
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    {assessment.improvementTip && (
                      <CardContent>
                        <p className="text-sm text-white">
                          {assessment.improvementTip}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog
            open={!!selectedInterview}
            onOpenChange={() => setSelectedInterview(null)}
          >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-black">
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <InterviewResult resultData={selectedInterview} hideStartNew />
            </DialogContent>
          </Dialog>
        </>
      </div>
    </div>
  );
}
