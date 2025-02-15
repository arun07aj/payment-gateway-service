import { NextResponse } from "next/server";
import { getAllTransactions } from "@/utils/db";

export async function GET() {
  return NextResponse.json(getAllTransactions(), { status: 200 });
}
