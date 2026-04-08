import { NextResponse } from "next/server";

type SerpResult = {
  title?: string;
  link?: string;
  snippet?: string;
};

type SerpApiResponse = {
  error?: string;
  organic_results?: SerpResult[];
};

export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if(!query){
        return NextResponse.json(
            { error: "Query is required.." },
            { status: 400 }
        );
    }

    try {

        const searchResponse = await fetch(
            `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_API_KEY}`
        );
        const data: SerpApiResponse = await searchResponse.json();

        if(data.error){
            return NextResponse.json(
                { error: data.error },
                { status: 400 }
            )
        }

        const results = data.organic_results?.slice(0, 10).map(( res ) => ({
            title: res.title,
            link: res.link,
            snippet: res.snippet
        })) || [];
        
        return NextResponse.json({ results });

    } catch {
        return NextResponse.json(
            { error: "Failed to fetch results.."},
            { status: 500 }
        )
    }
}