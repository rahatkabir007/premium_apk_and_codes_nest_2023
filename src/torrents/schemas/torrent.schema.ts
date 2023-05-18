// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import * as mongoose from "mongoose";
import { Document } from "mongoose";
// import { User } from "src/users/schemas/user.schema";

export type TORRENTDocument = TORRENT & Document;


// apkObj.title = title
// // apkObj.imgSrc = imgSrc
// apkObj.created = created
// apkObj.createdDate = createdDate
// apkObj.categories = categoriesInnerText
// apkObj.htmlContent = htmlContent || "";

@Schema({ timestamps: true })
export class TORRENT {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    imgSrc: string;

    @Prop({ required: true })
    created: string;

    @Prop({ required: true })
    createdDate: Date;

    @Prop({ required: true })
    categories: string;

    @Prop({ required: true })
    htmlContent: string;

    @Prop({ required: true })
    tags: string;


    @Prop({ required: true })
    allText: Array<string>;

    @Prop({ required: true })
    comment: string;

    @Prop({ required: true })
    page: number;

}

export const TORRENTSchema = SchemaFactory.createForClass(TORRENT);
