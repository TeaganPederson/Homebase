// app/whale-watcher/api/route.ts

import { NextResponse } from "next/server";
import { getTransactions } from "../../../lib/whaleTransactions";

export async function GET() {
  try {
    const transactions = getTransactions();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    console.error("WhaleWatcher API route error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}


