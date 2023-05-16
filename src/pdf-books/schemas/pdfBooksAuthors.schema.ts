// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import * as mongoose from "mongoose";
import { Document } from "mongoose";
export type PdfBookAuthorDocument = PdfBookAuthor & Document;

@Schema({ timestamps: true })
export class PdfBookAuthor {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    img: string;

    @Prop()
    downloadLink: string;

}

export const PdfBookAuthorSchema = SchemaFactory.createForClass(PdfBookAuthor);
