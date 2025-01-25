import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { beneficiaries, accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";

// Validation schema
const beneficiarySchema = z.object({
  walletAddress: z.string().optional(),
  email: z.string().email("Invalid email address"),
  trustPercentage: z.string(),
  relationship: z.string().optional(),
  phoneNumber: z.string().optional(),
  accountWalletAddress: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = beneficiarySchema.parse(body);

    if (validatedData.walletAddress) {
      // Get the authenticated user's account ID
      const account = await db.query.accounts.findFirst({
        where: eq(accounts.walletAddress, validatedData.walletAddress),
      });

      if (!account) {
        return NextResponse.json(
          {
            success: false,
            message: "Account not found",
          },
          { status: 404 }
        );
      }

      // Create the beneficiary record
      const beneficiary = await db
        .insert(beneficiaries)
        .values({
          email: validatedData.email,
          trustPercentage: validatedData.trustPercentage.toString(),
          relationship: validatedData.relationship,
          phoneNumber: validatedData.phoneNumber,
          accountWalletAddress: validatedData.accountWalletAddress,
        })
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: "Beneficiary added successfully",
          data: beneficiary,
        },
        { status: 201 }
      );
    } else {
      const beneficiary = await db
        .insert(beneficiaries)
        .values({
          email: validatedData.email,
          trustPercentage: validatedData.trustPercentage.toString(),
          relationship: validatedData.relationship,
          phoneNumber: validatedData.phoneNumber,
          accountWalletAddress: validatedData.accountWalletAddress,
        })
        .returning();

      return NextResponse.json(
        {
          success: true,
          message: "Beneficiary added successfully",
          data: beneficiary,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("DFASDFASDFASDF", error);
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

// Optional: GET endpoint to fetch beneficiaries
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountWalletAddress = searchParams.get("address");

    if (!accountWalletAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Address query parameter is required",
        },
        { status: 400 }
      );
    }
    const fetchedBeneficiaries = await db
      .select()
      .from(beneficiaries)
      .where(eq(beneficiaries.accountWalletAddress, accountWalletAddress));

    return NextResponse.json({
      success: true,
      data: fetchedBeneficiaries,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    // Validate input
    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "ID and status are required",
        },
        { status: 400 }
      );
    }

    // Update the beneficiary status in the database
    const updatedBeneficiary = await db
      .update(beneficiaries)
      .set({ status })
      .where(eq(beneficiaries.id, id))
      .returning();

    if (!updatedBeneficiary) {
      return NextResponse.json(
        {
          success: false,
          message: "Beneficiary not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBeneficiary,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
