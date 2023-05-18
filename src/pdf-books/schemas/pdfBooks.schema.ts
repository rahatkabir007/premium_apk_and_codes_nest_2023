// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";
import { PdfBookAuthor } from "./pdfBooksAuthors.schema";


export type PdfBookDocument = PdfBook & Document;

@Schema({ timestamps: true })
export class PdfBook {
    // @Prop({ required: true })
    // title: string;

    @Prop()
    bookTitle: string;

    @Prop()
    description: string;

    @Prop()
    img: string;

    @Prop()
    downloadLink: string;

    @Prop()
    readingLink: string;

    @Prop()
    publishedYear: string;

    @Prop()
    publisher: string;

    @Prop()
    genres: string;

    @Prop()
    authors: string;

    @Prop()
    bookPages: string;

    @Prop()
    language: string;

    @Prop()
    physicalForm: string;

    @Prop()
    type: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "PdfBookAuthor" })
    authorMongoDBId: PdfBookAuthor;

    @Prop()
    page: number;

    @Prop()
    authorYesPdfId: string[];

    @Prop()
    bookYesPdfId: string;

}

export const PdfBookSchema = SchemaFactory.createForClass(PdfBook);
