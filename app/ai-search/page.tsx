"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"

export default function AISearch() {

  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { messages, sendMessage, status } = useChat({
    onError: ( error: any) => {
      const errorMessage = error?.message;
      setError(errorMessage);
    }
  })

  return (
    <div className="flex flex-col items-center py-4">
      { messages.length === 0 && (
        <div className="text-center mb-4">
          <p className="text-2xl font-bold mb-2">AI Search</p>
          <h1 className="text-gray-400" >Search with AI Assistance</h1>
        </div>
      )}

      <div className="flex-1 space-y-3 mb-4 pb-20 w-full">
        { messages.map((m) => (
          <div 
            key={m.id} 
            className={`p-3 rounded-lg w-full ${
              m.role === "user"
                ? "bg-gray-800 max-w-[55%] ml-auto"
                : "bg-slate-100 max-w-[55%] text-gray-600"
            }`}
          >
            <div className="text-sm mb-1">
              { m.role === "user" ? "You" : "AI" }
            </div>

            <div className="whitespace-pre-wrap">
              { m.parts.map((part: any, i) => {

                if(part.type === "text"){
                  return (
                    <div key={`${m.id}-${i}`} className="">
                      {part.text}
                    </div>
                  );
                }

                if(part.type?.startsWith("tool-")){
                  const toolInvocation = part.toolInvocation;

                  if(toolInvocation?.state === "result"){
                    const result = toolInvocation.result;
                    return (
                      <div key={`${m.id}-${i}`} className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                        <div className="font-semibold text-gray-700 mb-1">
                          Search Results
                        </div>
                        { result.results?.map((r: any, idx: number) => (
                          <div key={idx} className="mb-2">
                            <a 
                              href={r.link} 
                              className="text-blue-600 hover:underline font-medium"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              { r.tittle }
                            </a>
                            <p className="text-gray-600 text-sm">{ r.snippet }</p>
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return null;
                }
              })}
            </div>
          </div>
        ))}

        { status === "submitted" && (
          <div className="text-sm text-gray-500 animate-pulse">Thinking..</div>
        )}

        { error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        { messages.length === 0 && (
            <p className="text-center text-white">Ask me anything..</p>
        )}

        <div className="fixed bottom-10 left-0 w-full flex justify-center px-4">
          <form
            className="w-full max-w-3xl flex items-center gap-2 bg-white p-4 rounded-lg"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              setError(null);
              sendMessage({ text: input });
              setInput("");
            }}
          >
            <input
              type="text"
              className="flex-1 border border-gray-300 p-2 rounded-lg text-black"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something.."
              disabled={status === "submitted"}
            />

            <button
              type="submit"
              className="bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
              disabled={status === "submitted" || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
