import { NextRequest, NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { getTransactionStatus, saveTransactionStatus } from "@/utils/db";

export async function POST(req: NextRequest) : Promise<NextResponse> {
  try {
    const { id } = await req.json();
    const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;

    // fetch status from DB, if exists
    const dbStatus = await getTransactionStatus(id);
    if (dbStatus) {
      return NextResponse.json({ status: dbStatus, transactionId: id }, { status: 200 });
    }

    const st = `/pg/v1/status/${merchantId}/${id}` + process.env.NEXT_PUBLIC_SALT_KEY;
    const dataSha256 = sha256(st).toString();
    const checksum = dataSha256 + "###" + process.env.NEXT_PUBLIC_SALT_INDEX;

    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL}/pg/v1/status/${merchantId}/${id}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
      },
    };

    const response = await axios.request(options);
    //console.log("Check Status response:\n", response);

    if (response.data.code === "PAYMENT_SUCCESS") {
      await saveTransactionStatus(id, "PAYMENT_SUCCESS");
      
      return NextResponse.json(
        {
          status: response.data.code,
          transactionId: id,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "FAIL",
          referenceId: null,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in payment status check:", error);
    return NextResponse.json(
      {
        status: "SERVER ERROR",
      },
      { status: 500 }
    );
  }
}
