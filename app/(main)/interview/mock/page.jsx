import Quiz from "../_components/quiz";

const { Button } = require("@/components/ui/button")
const { ArrowBigLeft } = require("lucide-react")
const { default: Link } = require("next/link")

const MockInterviewPage=()=>{
    return(
        <div className="container mx-auto space-y-4 py-6">
            <div className="flex flex-col space-y-2 mx-2">
                <Link href={"/interview"}>
                    <Button variant={"link"} className="gap-2 pl-0 text-white">
                        <ArrowBigLeft className="h-4 w-4 text-white"/>
                        Back to Interview Preparation
                    </Button>
                </Link>
                <div>
                    <h1 className="text-6xl font-bold gradient  tracking-tighter  text-transparent bg-clip-text pb-2">Mock Interview</h1>
                    <p className="text-white">
                        Test your with industry-specific question
                    </p>
                </div>
            </div>
            <Quiz/>
        </div>
    )
};

export default MockInterviewPage;