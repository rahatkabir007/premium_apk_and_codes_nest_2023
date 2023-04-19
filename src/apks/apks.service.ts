import { Injectable } from '@nestjs/common';
import { CreateApkDto } from './dto/create-apk.dto';
import { UpdateApkDto } from './dto/update-apk.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
import { APK, APKDocument } from './schemas/apk.schema';
import { main } from 'src/utils/main';

@Injectable()
export class ApksService {
  constructor(
    @InjectModel(APK.name, DATABASE_CONNECTION.APK)
    private apkModel: Model<APKDocument>
    // eslint-disable-next-line no-empty-function
  ) { }

  async create(createApkDto: CreateApkDto) {
    try {
      const result = await main(); // Call the main function and capture the return value
      console.log('apkObj',result); // Output the return value to the console
    } catch (error) {
      console.error(error);
    }
    // console.log('apkObj',apkObject)
    // const apk = await this.apkModel.create({
    //   name: "hello apk 2",
    //   description: "bye"
    // })
    // return apk;
  }

  findAll() {
    return `This action returns all apks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apk`;
  }

  update(id: number, updateApkDto: UpdateApkDto) {
    return `This action updates a #${id} apk`;
  }

  remove(id: number) {
    return `This action removes a #${id} apk`;
  }
}
