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
    name: string;

    @Prop({ required: true })
    description: string;

}

export const CodeSchema = SchemaFactory.createForClass(Code);
