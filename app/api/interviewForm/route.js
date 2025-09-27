// app/api/interview-form/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";


// POST: Create new interview form


export async function POST(req) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return new Response("Unauthorized", { status: 401 });

    // Find the actual User record in your database
    const user = await db.user.findUnique({
      where: { clerkUserId },
    });
    if (!user) return new Response("User not found", { status: 404 });

    const body = await req.json();
    const experience = Number(body.experience);
    const numQuestions = Number(body.numQuestions);

    const newForm = await db.interviewForm.create({
      data: {
        userId: user.id,  
        type: body.type,
        industry: body.industry || "",
        project: body.project,
        experience,
        skills: body.skills || [],
        numQuestions,
      },
    });

    return new Response(JSON.stringify(newForm), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

// GET: Get all interview forms of the logged-in user
export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { status: "failed", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const forms = await db.interviewForm.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { status: "success", forms, message: `${forms.length} forms found` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "failed", message: "Failed to fetch forms" },
      { status: 400 }
    );
  }
}
