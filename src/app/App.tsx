"use client";

import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult]: [Array<string>, Dispatch<SetStateAction<Array<string>>>] = useState<Array<string>>([]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/llm', { prompt });

      const formattedResult = response.data.result.split('\\n\\n');
      setResult(formattedResult);
    } catch (error) {
      console.error(error);
      setResult(['Error generating response']);
    }
  };

  return (
    <div>
      <h1>K-GPT</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Result:</h2>
        {result.map((res, key) => {
          return (
            <p key={key}>{res}</p>
          )
        })}
      </div>
    </div>
  );
}