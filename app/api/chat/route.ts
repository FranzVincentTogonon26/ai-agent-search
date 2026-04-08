import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import z from "zod";


const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
})

export async function POST( req: Request){
    try {
        const { messages } = await req.json();
        const modelMessages = await convertToModelMessages(messages);

        const result = streamText({
            model: openRouter("minimax/minimax-m2.5:free"),
            system: "You are AI Assistant, a smart, modern, and reliable. Use the search tool to find real-time information when needed.",
            messages: modelMessages,
            stopWhen: stepCountIs(5),
            tools: {
                search: tool({
                    description: "Search the web for current events, facts, or real-time information.",
                    inputSchema: z.object({
                        query: z.string().describe("The search query to look up on the internet."),
                    }),
                    execute: async ({ query }) => {
                        const searchResponse = await fetch(
                            `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_API_KEY}`
                        );
                        const searchData = await searchResponse.json();

                        return {
                            results: searchData.organic_results?.slice(0, 5).map((res: any) => ({
                                title: res.title,
                                link: res.link,
                                snippet: res.snippet
                            }))
                        }
                    }
                })
            }
        });

        return result.toUIMessageStreamResponse();

    } catch {
        return new Response(
            JSON.stringify({ error: "An error occured. Please try again." }),
            { status: 500, headers: {"Content-Type": "application/json"}}
        )
    }
}