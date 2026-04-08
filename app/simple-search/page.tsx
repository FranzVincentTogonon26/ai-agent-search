"use client"

import { useState } from "react";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export default function SimpleSearch() {

  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState('')

  const handleSearch = async (e: React.ChangeEvent) => {
    e.preventDefault();
    if(!query.trim()) return;

    try {
      setLoading(true)
      const res = await fetch(`api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if(data.error){
        setError(data.error)
        return;
      }

      setResults(data.results || [])

    } catch {
      setError("Failed to fecth results..")
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="w-full mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Native Search</h1>
        <p className="text-gray-600">Direct search without AI</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={query}
          onChange={ (e) => setQuery(e.target.value) }
          placeholder="Enter search query..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none" 
        />
        <button 
          className="bg-gray-700 text-white px-6 py-2 rounded-lg font-medium text-center"
          disabled={loading || !query.trim()}
          type="submit"
        >
          { loading ? 'Searching...' : 'Search' }
        </button>
      </form>

      { error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        { results.map(( result, index ) => (
          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
            <a 
              target="_blank"
              rel="noopener noreferrer"
              href={result.link}
              className="text-gray-400 font-bold hover:underline"
            >
              {result.title}
            </a>
            <p className="text-sm text-gray-600 mt-1">{result.snippet}</p>
          </div>
        ))}

        { results.length === 0 && !loading && error && (
          <p className="text-center text-gray-500">Enter a query to serach</p>
        )}
      </div>

    </div>
  );
}
