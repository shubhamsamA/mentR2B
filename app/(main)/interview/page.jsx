import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import QuizList from "./_components/quiz-list";
import PerformanceChart from "./_components/performace-chart";



const InterviewPage = async ()=>{
    
     const assessments = await getAssessments();
   return (
    <div >
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
export default InterviewPage;