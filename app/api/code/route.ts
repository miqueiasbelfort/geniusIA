import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const promptComando = {
    role: "system",
    content: "You are a code generator. You must answer only in Markdown code snippets. Use code comments to explanations."
}

export async function POST(req: Request) {
    try {

        const {userId} = auth();
        
        const body = await req.json();
        const {message} = body;

        if(!userId){
            return new NextResponse("Unathorized", {status: 401});
        }

        if(!openai){
            return new NextResponse("OpenAI Api key not configurate", {status: 500});
        }

        if(!message){
            return new NextResponse("Messages are required", {status: 400});
        }

        const response = await openai.chat.completions.create({
            messages: [promptComando, ...message],
            model: "gpt-3.5-turbo",
        })

        return NextResponse.json(response.choices[0].message.content);

    } catch (error) {
        console.log("['CODE_ERROR']", error);
        return new NextResponse("Internal error", {status: 500});
    }
}