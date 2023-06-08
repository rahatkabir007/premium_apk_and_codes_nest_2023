// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import * as mongoose from "mongoose";
import { Document } from "mongoose";
// import { User } from "src/users/schemas/user.schema";

export type CodeDocument = Code & Document;

@Schema({ timestamps: true })
export class Code {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    img: string;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    date: string;

    @Prop({ required: true })
    mongoDbDate: string;

    @Prop({ required: true })
    url: string;

    @Prop()
    htmlContent: string;

    @Prop({ required: true })
    downloadLinks: Array<string>;

    @Prop({ required: true })
    page: number;

}

export const CodeSchema = SchemaFactory.createForClass(Code);

// Add indexing code here
CodeSchema.index({ createdAt: -1 });
CodeSchema.index({ page: 1 });
CodeSchema.index({ mongoDbDate: -1 });

export const CodeSchema = CodeSchema;
