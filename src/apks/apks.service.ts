import { Injectable } from '@nestjs/common';
import { CreateApkDto } from './dto/create-apk.dto';
import { UpdateApkDto } from './dto/update-apk.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
import { APK, APKDocument } from './schemas/apk.schema';
import { apkScrapping} from 'src/utils/ApkScrapping';

@Injectable()
export class ApksService {
  constructor(
    @InjectModel(APK.name, DATABASE_CONNECTION.APK)
    private apkModel: Model<APKDocument>
    // eslint-disable-next-line no-empty-function
  ) { }

  async create(createApkDto: CreateApkDto) {
    try {
      const result:any = await apkScrapping(); // Call the main function and capture the return value
      console.log('apkObj', result); // Output the return value to the console
       for (let i = 0; i < result?.length; i++) {
        await this.apkModel.findOneAndUpdate({ title: result[i].title }, result[i], { upsert: true, new: true })
      }
      return `Inserted To DB ${result}`
    } catch (error) {
      console.error(error);
      return error
    }
  
  }

  async findAllApkData(query: {page:number}) {
    console.log('query',query.page)
    const limit = 4;
    const page = query.page;
    const apkAllData = await this.apkModel.find().limit(limit).skip(((page as number) - 1) * (limit))
    const apkAllDataLength = (await this.apkModel.find()).length
    console.log('apkAllDataLenght',apkAllDataLength)
    return { apkAllData, apkAllDataLength }
  }

  async findOneApk(id: string) {
    const apkOne = await this.apkModel.findOne({ _id: id })
    return apkOne
  }

  update(id: number, updateApkDto: UpdateApkDto) {
    return `This action updates a #${id} apk`;
  }

  remove(id: number) {
    return `This action removes a #${id} apk`;
  }
}
