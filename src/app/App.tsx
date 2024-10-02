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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">K-GPT</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={5}
        />
        <button 
          type="submit" 
          className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
      <div className="mt-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Result:</h2>
        {result.map((res, key) => {
          return (
            <p key={key} className="bg-white p-4 rounded-md shadow mb-2">{res}</p>
          )
        })}
      </div>
    </div>
  );
}