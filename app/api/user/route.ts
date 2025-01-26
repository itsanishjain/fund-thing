import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { accounts } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newAccount = await db
      .insert(accounts)
      .values({
        email: body.email,
        walletAddress: body.walletAddress,
      })
      .onConflictDoUpdate({
        target: accounts.walletAddress,
        set: {
          email: body.email,
        },
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Account added successfully",
        data: newAccount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("FFFFF", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
