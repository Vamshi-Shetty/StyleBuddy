import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Point to your Flask server endpoint
    const flaskResponse = await axios.post("http://localhost:5000/chat", {
      message: body.message
    });
    
    return NextResponse.json(flaskResponse.data);
  } catch (error) {
    console.error("Error communicating with recommendation engine:", error);
    return NextResponse.json(
      { error: "Failed to get outfit recommendation" },
      { status: 500 }
    );
  }
}