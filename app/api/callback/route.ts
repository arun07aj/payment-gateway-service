import { NextRequest, NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import { saveTransactionStatus } from "@/utils/db";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const receivedXVerify = req.headers.get("X-VERIFY");

    console.log("Validating callback...")

    if (!body?.response || !receivedXVerify) {
      console.error("Invalid request received during callback: ", body);
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Signature Verification
    const dataToHash = body.response + process.env.NEXT_PUBLIC_SALT_KEY;
    const computedSha256 = sha256(dataToHash).toString();
    const expectedXVerify = `${computedSha256}###${process.env.NEXT_PUBLIC_SALT_INDEX}`;

    if (receivedXVerify !== expectedXVerify) {
      console.error("Signature mismatch, request may've been tampered!");
      return NextResponse.json({ error: "Signature mismatch" }, { status: 403 });
    }

    console.log("Callback received, passed integrity check of XVerify.")

    // Decode Response from Base64
    let transactionData;
    try {
      const decodedResponse = Buffer.from(body.response, "base64").toString("utf-8");
      transactionData = JSON.parse(decodedResponse);
    } catch (err) {
      console.error("Failed to decode Base64 response:", err);
      return NextResponse.json({ error: "Invalid response format" }, { status: 400 });
    }

    console.log("Callback received:", transactionData);

    // Store Transaction in Temp DB
    await saveTransactionStatus(transactionData.data.transactionId, transactionData.code);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Error handling callback:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
