import { spawn } from "child_process";
import { NextResponse } from "next/server";

export async function postLlm(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    // Stream the Python process output to the client
    return new Response(
      new ReadableStream({
        start(controller) {
          const pythonProcess = spawn("/scripts/venv/bin/python3", ["./scripts/run_model.py", prompt]);

          // Handle stdout data from the Python process
          pythonProcess.stdout.on("data", (data) => {
            const chunk = new TextEncoder().encode(data);
            controller.enqueue(chunk); // Stream chunk to client
          });

          // Handle process completion
          pythonProcess.stdout.on("end", () => {
            controller.close(); // Close the stream when done
          });

          // Handle errors
          pythonProcess.stderr.on("data", (data) => {
            console.error(`Error: ${data}`);
            controller.error(data); // Propagate errors to the client
          });
        },
      }),
      {
        headers: { "Content-Type": "text/plain" },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
