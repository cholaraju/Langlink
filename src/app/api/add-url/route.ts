import { getUserCoins } from "@/actions/fetchActions";
import { summarySchema } from "@/validations/summaryValidation";
import vine, { errors } from "@vinejs/vine";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { Document } from "@langchain/core/documents";
import prisma from "@/lib/db.config";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
    }
    const body = await req.json();
    const validator = vine.compile(summarySchema);
    const payload = await validator.validate(body);
    //* check user has coins or not

    const userCoins = await getUserCoins(payload.user_id);
    if (userCoins === null || (userCoins.coins && userCoins.coins < 10)) {
      return NextResponse.json(
        {
          message:
            "You don't have sufficient coins for summary . please add more coins.",
        },
        { status: 400 }
      );
    }
    let text: Document<Record<string, any>>[];
    try {
      const loader = YoutubeLoader.createFromUrl(payload.url, {
        language: "en",
        addVideoInfo: true,
      });
      text = await loader.load();
      console.log(text);
    } catch (error) {
      return NextResponse.json(
        {
          message:
            "No Transcript found for this video  please try  with another video",
        },
        { status: 404 }
      );
    }

    //* Add entry in summary
     

    const summary = await prisma.summary.create({
      data: {
        ...payload,
        user_id:Number(payload.user_id),
        title:text[0].metadata.title ?? "404 Title PodBite "
      }
    })

    return NextResponse.json({ message: "Url Added succesfully",data:summary });
  } catch (error) {
    console.log("The Add URL error", error);
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        {
          messsage: "please check validation errors",
          errors: error.messages,
        },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { message: "something went wrong , please try again" },
      { status: 500 }
    );
  }
}
