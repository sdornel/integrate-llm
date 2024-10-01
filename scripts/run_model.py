#!/scripts/venv/bin/python3
import sys
import json
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')


def generate_gpt3_response(prompt):
    try:
        client = OpenAI(api_key=api_key)

        response = client.chat.completions.create(
            model = "gpt-3.5-turbo",
            messages = [
                {"role": "user", "content": prompt},
            ]
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Error occurred: {str(e)}"

if __name__ == "__main__":
    # Read prompt from command-line argument (passed from Node.js)
    prompt = sys.argv[1] if len(sys.argv) > 1 else "Default prompt"
    
    gpt3_response = generate_gpt3_response(prompt)
    
    # Send output to Node llm.ts file
    print(json.dumps(gpt3_response))