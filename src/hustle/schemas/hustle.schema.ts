// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import * as mongoose from "mongoose";
import { Document } from "mongoose";
// import { User } from "src/users/schemas/user.schema";

export type HUSTLEDocument = HUSTLE & Document;

@Schema({ timestamps: true })
export class HUSTLE {
    @Prop({ required: true })
    imgText: string;

    @Prop({ required: true })
    hustleTitle: string;

    @Prop({ required: true })
    imgSrc: string;

    @Prop({ required: true })
    workType: Array<string>;

    @Prop({ required: true })
    jobType: string;

    @Prop({ required: true })
    workTypeFullText: string;

    @Prop({ required: true })
    companyDemoIcon: string;

    @Prop({ required: true })
    companyDemoDesc: Array<string>;

    @Prop({ required: true })
    signUpurl: string;

    @Prop()
    equipmentAll: Array<string>;


    @Prop({ required: true })
    averagePay: Array<string>;


    @Prop({ required: true })
    makingMoney: Array<string>;


    @Prop({ required: true })
    platformPricing: Array<string>;


    @Prop({ required: true })
    audience: Array<string>;


    @Prop({ required: true })
    founded: Array<string>;

    @Prop({ required: true })
    founding: string;


    // hustleObj.imgText = imgText
    // hustleObj.imgSrc = imgSrc
    // hustleObj.workType = workType
    // hustleObj.jobType = jobType
    // hustleObj.workTypeFullText = workTypeFullText
    // hustleObj.companyDemoIcon = companyDemoIcon
    // hustleObj.companyDemoDesc = companyDemoDesc
    // hustleObj.signUpurl = signUpurl
    // hustleObj.equipmentAll = equipmentAll
    // hustleObj.averagePay = averagePay
    // hustleObj.makingMoney = makingMoney
    // hustleObj.platformPricing = platformPricing
    // hustleObj.audience = audience
    // hustleObj.founded = founded
    // hustleObj.founding = founding

}

export const HustleSchema = SchemaFactory.createForClass(HUSTLE);





// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck
// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// // import * as mongoose from "mongoose";
// import { Document } from "mongoose";
// // import { User } from "src/users/schemas/user.schema";

// export type HUSTLEDocument = HUSTLE & Document;

// @Schema({ timestamps: true })
// export class HUSTLE {
//     @Prop({ required: true })
//     imghref: string;

//     @Prop({ required: true })
//     imgSrc: string;
//     @Prop({ required: true })
//     tags: Array<string>;

//     @Prop({ required: true })
//     applyHref: string;

//     @Prop({ required: true })
//     description: Array<string>;

//     @Prop({ required: true })
//     founded: string;

//     @Prop({ required: true })
//     requirement: Array<string>;

//     @Prop({ required: true })
//     pricing: string;

//     @Prop()
//     category: string;

// }

// export const HustleSchema = SchemaFactory.createForClass(HUSTLE);
