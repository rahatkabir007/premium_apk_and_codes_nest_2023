// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import * as mongoose from "mongoose";
import { Document } from "mongoose";
// import { User } from "src/users/schemas/user.schema";

export type APKDocument = APK & Document;

@Schema({ timestamps: true })
export class APK {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    imgSrc: string;

    @Prop({ required: true })
    createdAt: string;

    @Prop({ required: true })
    categories: string;

    @Prop({ required: true })
    version: string;

    @Prop({ required: true })
    fileSize: string;

    @Prop({ required: true })
    allText: string;

    // @Prop({ required: true })
    // downloadFile: {
    //     type: [
    //       {
    //         href:  String,
    //         innerText:String
    //       }
    //     ]
    //   }

}

export const APKSchema = SchemaFactory.createForClass(APK);
