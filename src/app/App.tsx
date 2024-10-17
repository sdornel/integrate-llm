"use client";

import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { Tooltip } from '@nextui-org/tooltip';

type SpeechRecognitionType = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

export default function Home() {
  const [prompt, setPrompt]: [string, Dispatch<SetStateAction<string>>] = useState<string>('');
  const [result, setResult]: [Array<string>, Dispatch<SetStateAction<Array<string>>>] = useState<Array<string>>([]);
  const [listening, setListening] = useState<boolean>(false);
  const [browserSupportsVoice, setBrowserSupportsVoice] = useState<boolean>(true);

  let recognition: SpeechRecognitionType | undefined;

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // TODO: make dynamic

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setPrompt(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error detected: ' + event.error);
      };

      if (listening) {
        recognition.start();
      } else {
        recognition.stop();
      }
    } else {
      setBrowserSupportsVoice(false);
      console.error("Browser doesn't support speech recognition.");
    }

    // cleanup on unmount
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [listening]);

  const handleListen = () => {
    setListening(!listening);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult([]); // Clear previous results
  
    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
  
      let accumulatedResult = ''; // This stores the accumulated text
  
      while (!done) {
        const { value, done: readerDone } = await reader?.read() ?? {};
        if (readerDone) {
          done = readerDone;
        }
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedResult += chunk;
  
          setResult((prevResult) => [...prevResult, chunk]);
        }
      }
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

      <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-md shadow mb-2">
          {result.map((res, key) => (
            <span key={key}>{res}</span>
          ))}
      </div>

      {/* new component for microphone? use store? */}
      <div className="flex flex-col items-center">
        <Tooltip content={!browserSupportsVoice ? 'Your browser does not support voice recognition' : ''}>
          <button
            onClick={handleListen}
            className={`p-4 rounded-full text-white ${!browserSupportsVoice ? 'bg-gray-500' : listening ? 'bg-red-500' : 'bg-green-500'}`}
            disabled={!browserSupportsVoice}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1v11m0 4v6m-6-6h12m-6-6a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}