import { Injectable } from '@nestjs/common';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Code, CodeDocument } from './schemas/code.schema';
import { Model } from 'mongoose';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
import { codeScrapping } from 'src/utils/CodeScrapping';


export interface codeDataType {
  title: string;
  description: string;
  img: string;
  category: string;
  date: string;
  downloadLinks: string[];
}

@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Code.name, DATABASE_CONNECTION.CODE)
    private codeModel: Model<CodeDocument>
    // eslint-disable-next-line no-empty-function
  ) { }


  async create(createCodeDto: CreateCodeDto) {
    try {
      const result = await codeScrapping();
      console.log('codeArray', result);

      return result
    } catch (error) {
      console.error(error);
    }
  }

  async createCodeDatas() {
    try {
      const result: any = await codeScrapping();
      for (let i = 0; i < result?.length; i++) {
        await this.codeModel.findOneAndUpdate({ title: result[i].title }, result[i], { upsert: true, new: true })
      }
      return "Inserted To DB"
    } catch (error) {
      console.error(error);
    }
  }

  async findAllCodeDatas(query) {
    let limit = parseInt(query.limit) || 3;
    // let limit = 10
    const page = parseInt(query.page) || 1;
    // const page = 1;
    if (limit === -1) {
      limit = 0;
    }
    // const usersPortfolios = await this.portfolioModel.find(finalQueryObj)
    //   .limit(limit)
    //   .skip((page - 1) * limit)
    //   .sort({ createdAt: "asc" })
    //   .exec();
    const codes = await this.codeModel.find().limit(limit).skip((page - 1) * limit).exec();
    const totalCodeLength = await this.codeModel.count()
    return { codes, totalCodeLength }
  }

  async findOneCodeData(id) {
    const code = await this.codeModel.findOne({ _id: id })
    console.log("🚀 ~ file: codes.service.ts:59 ~ CodesService ~ findOneCodeData ~ code:", code)
    return code
  }

  findAll() {
    return `This action returns all codes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} code`;
  }

  update(id: number, updateCodeDto: UpdateCodeDto) {
    return `This action updates a #${id} code`;
  }

  remove(id: number) {
    return `This action removes a #${id} code`;
  }
}
