import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { accounts, beneficiaries } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const uuid = body.uuid;

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

    if (uuid) {
      const u = await db
        .update(beneficiaries)
        .set({
          status: "Pending",
        })
        .where(eq(beneficiaries.email, body.email))
        .returning({
          id: beneficiaries.id,
          status: beneficiaries.status,
        });

      console.log(u);
    }

    console.log("Seeing UUID", uuid);

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
