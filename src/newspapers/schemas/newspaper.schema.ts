import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import * as mongoose from "mongoose";
import { Document } from "mongoose";
// import { User } from "src/users/schemas/user.schema";

export type NewspaperDocument = Newspaper & Document;

@Schema({ timestamps: true })
export class Newspaper {
    @Prop({ required: true })
    newspaperName: string;

    @Prop({ required: true })
    img: string;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    url: string;

    @Prop()
    htmlContent: string;


}

export const NewspaperSchema = SchemaFactory.createForClass(Newspaper);
