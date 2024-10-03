"use client";

import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt]: [string, Dispatch<SetStateAction<string>>] = useState<string>('');
  const [result, setResult]: [Array<string>, Dispatch<SetStateAction<Array<string>>>] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/llm', { prompt });
      console.log('response', response); // for debugging
      const formattedResult = response.data.result.split('\\n\\n');
      setResult(formattedResult);
    } catch (error) {
      console.error(error);
      setResult(['Error generating response']);
    } finally {
      setLoading(false);
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

      <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-md shadow mb-2">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          result.map((res, key) => (
            <p key={key}>{res}</p>
          ))
        )}
      </div>
    </div>
  );
}