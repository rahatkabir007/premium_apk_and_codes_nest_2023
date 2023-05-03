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

  
    // async create(createApkDto: CreateApkDto) {
    // try {
    //   const result:any = await apkScrapping(); // Call the main function and capture the return value
    //   console.log('apkObj', result); // Output the return value to the console
    //   //  for (let i = 0; i < result?.length; i++) {
    //   //   await this.apkModel.findOneAndUpdate({ title: result[i].title }, result[i], { upsert: true, new: true })
    //   // }
    //   const promises = result.map(async (data) => {
    //     await this.apkModel.findOneAndUpdate({ title: data.title }, data, { upsert: true, new: true });
    //   });
    //   await Promise.all(promises);
    //   return `Inserted To DB ${result}`
    // } catch (error) {
    //   console.error(error);
    //   return error
    //   }
    // }

 async create(res, isWorking,queries: {page:number}) {
    res.send('Scrapping Initiated Apk');
    console.log("route hit Apk");
    setTimeout(async () => {
      try {
      console.log('Timeout hit');
      const result:any = await apkScrapping(queries.page); // Call the main function and capture the return value
      const promises = result.map(async (data) => {
        await this.apkModel.findOneAndUpdate({ title: data.title }, data, { upsert: true, new: true });
      });
      
      await Promise.all(promises);
      console.log('DB insert');
      isWorking = false
      return "Inserted to DB"
      // res.send("Inserted to DB")
        
    } catch (error) {
      console.error(error);
      isWorking = false
      res.status(500).send('Error occurred during scraping');
    }
    }, 3000);
  }
 

  async findAllApkData(query: {page:number}) {
    console.log('query',query.page)
    const limit = 8;
    const page = query.page;
    const apkAllData = await this.apkModel.find().limit(limit).skip(((page as number) - 1) * (limit))
    const apkAllDataLength = (await this.apkModel.find().count())
    console.log('apkAllDataLength',apkAllDataLength)
    return { apkAllData, apkAllDataLength }
  }

  async findAllApkDataSearch(query: {search:string,page:number}) {
    console.log('query',query.search)
    console.log('page',query.page)
    const limit = 8;
    const searchValue = query.search;
    const page = query.page;
    const apkAllDataSearch = await this.apkModel.find({ "title": { $regex: searchValue, $options: 'i' } }).limit(limit).skip(((page as number) - 1) * (limit))
    const apkAllDataLengthSearch = await this.apkModel.find({ "title": { $regex: searchValue, $options: 'i' } }).count()
    // const catSubLastObj = await this.apkModel.findOne({title:null});
    // const catSub=catSubLastObj.catSub
    console.log('apkAllDataLenght', apkAllDataLengthSearch)
    console.log('apkAllDataSearch',apkAllDataSearch)
    return { apkAllDataSearch, apkAllDataLengthSearch }
  }

  async findAllCategorizedApk(query: { category: string, page: number,subCat:string }) {
    const limit =8;
    const apkValue = query.category;
    const page = query.page;
    const subCat = query.subCat || ''
    console.log('subCat',subCat,apkValue,page);
    const categorizedApk = await this.apkModel.find({
      "categories": { $regex: `.*${apkValue}.*${subCat}|.*${subCat}.*${apkValue}.*`, $options: 'i' }
      // "categories": { $regex: `.*${apkValue}.* `&& `.*${subCat}.*`, $options: 'i' },
        // "categories": { $regex: subCat, $options: 'i' } ,
    }).limit(limit).skip(((page as number) - 1) * (limit))
    
    const apkAllDataLengthCategorized = await this.apkModel.find({
      "categories": { $regex: `.*${apkValue}.*${subCat}|.*${subCat}.*${apkValue}.*`, $options: 'i' }
      // "categories": { $regex: `.*${apkValue}.*` && `.*${subCat}.*`, $options: 'i' },
      // "categories": { $regex: subCat, $options: 'i' } ,
    }).count()
    // const pageCountNumber = Math.ceil(categorizedCodesLength / limit)
    // const catSubLastObj = await this.apkModel.findOne({title:null});
    // const catSub = catSubLastObj.catSub
    console.log('categorizedApk',categorizedApk)
    console.log('apkAllDataLengthCategorized',apkAllDataLengthCategorized)
    return { categorizedApk, apkAllDataLengthCategorized}
  }

  async findOneApk(id: string) {
    const apkOne = await this.apkModel.findOne({ _id: id })
    return { apkOne}
  }

  update(id: number, updateApkDto: UpdateApkDto) {
    return `This action updates a #${id} apk`;
  }

  remove(id: number) {
    return `This action removes a #${id} apk`;
  }
}
