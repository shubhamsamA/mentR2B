import React from 'react'
import Overview from './_components/overview '
import { getMockInterviews } from '@/actions/mockInterview';

const Aiinterviewpage = async () => {
  
  const mockAssessments = await getMockInterviews();
  return (
    <div>
        <Overview mockAssessments={mockAssessments} />
    </div>
  )
}

export default Aiinterviewpage