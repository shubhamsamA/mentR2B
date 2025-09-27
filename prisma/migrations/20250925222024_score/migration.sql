/*
  Warnings:

  - Added the required column `interviewscore` to the `MockInterviewAssessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MockInterviewAssessment" ADD COLUMN     "interviewscore" DOUBLE PRECISION NOT NULL;
