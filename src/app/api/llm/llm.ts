import { exec } from "child_process";
import { NextResponse } from "next/server";

export async function postLlm(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;
  
    return new Promise((resolve, reject) => {
      exec(`/scripts/venv/bin/python3 ./scripts/run_model.py "${prompt}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          return reject(NextResponse.json({ error: "Error running model." }, { status: 500 }));
        }

        resolve(NextResponse.json({ result: stdout }, { status: 200 }));
      });
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
