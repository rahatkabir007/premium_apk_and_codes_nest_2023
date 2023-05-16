import { Injectable } from '@nestjs/common';
import { CreateHustleDto } from './dto/create-hustle.dto';
import { UpdateHustleDto } from './dto/update-hustle.dto';
import { HUSTLE, HUSTLEDocument } from './schemas/hustle.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
import { hustleScrapping } from 'src/utils/HustleScrapping/hustleScrapping';
let isWorking = false


@Injectable()
export class HustleService {
  constructor(
    @InjectModel(HUSTLE.name, DATABASE_CONNECTION.HUSTLE)
    private hustleModel: Model<HUSTLEDocument>
    // eslint-disable-next-line no-empty-function
  ) { }

  async createHustleDatas(res) {
    if (isWorking) {
      return res.status(409).json({ message: 'Work in progress' });
    }
    isWorking = true
    res.send('Scrapping Initiated');
    console.log("route hit");
    // setTimeout(async () => {
    try {
      // let apkObjArray = [];
      // console.log('Timeout hit');
      // const apkLastDate = await this.apkModel.find().sort({ createdDate: -1 })
      // const lastPScrap = await this.apkModel.find().sort({ page: 1 })
      // const firstPScrap = await this.apkModel.find().sort({ page: -1 })
      // const apkLastDt = apkLastDate[0]?.created || ''

      // const lastPageScrap = lastPScrap[0]?.page || 0
      // const firstPageScrap = firstPScrap[0]?.page || 0
      // const pageGap = (firstPageScrap - lastPageScrap) || 0
      // console.log('last page scrap', lastPageScrap)
      // console.log('first page scrap', firstPageScrap)
      // console.log('pageGap', pageGap)
      // console.log('apkLastDt', apkLastDt)
      // const { totalP, page, context } = await apkScrappingPageNumber();

      // console.log('totalP page', totalP)

      // let allReadMoreHref;
      // for (let i = totalP - pageGap; i >= 1; i--) {
      //   const result: any = await apkScrappingAllItems(page, apkLastDt, i);
      //   if (result === "continue") {
      //     continue;
      //   }
      //   allReadMoreHref = result;
      //   if (allReadMoreHref.length === 0) {
      //     break;
      //   }
      //   let apkObjArray = [];
      //   for (let j = allReadMoreHref.length - 1; j >= 0; j--) {
      //     const objResult: any = await apkScrappingSingleItem(page, apkLastDt, allReadMoreHref, j, context);
      //     if (objResult === "continue") {
      //       continue;
      //     }
      //     console.log("🚀 ~ file: codes.service.ts:98 ~ CodesService ~ setTimeout ~ objResult:", objResult)
      //     objResult.page = i
      //     console.log('objResult', objResult)
      //     apkObjArray.push(objResult)
      //   }

      // console.log("apkObjArray", apkObjArray)
      const hustleObjArray = await hustleScrapping();
      const promises = hustleObjArray.map(async (data) => {
        await this.hustleModel.findOneAndUpdate({ hustleTitle: data.hustleTitle }, data, { upsert: true, new: true });
      });

      await Promise.all(promises);
      console.log('DB insert');
      isWorking = false
      return "Inserted to DB"

      // console.log('DB insert', i, "page");
    }
    // const result:any = await apkScrapping(apkLastDt); // Call the main function and capture the return value


    // const promises = result.map(async (data) => {
    //   await this.apkModel.findOneAndUpdate({ title: data.title }, data, { upsert: true, new: true });
    // });

    // await Promise.all(promises);

    catch (error) {
      console.error(error);
      isWorking = false;
      res.status(500).send('Error occurred during scraping');
    }
    // }, 3000);
  }

  findAll() {
    return `This action returns all hustle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hustle`;
  }

  update(id: number, updateHustleDto: UpdateHustleDto) {
    return `This action updates a #${id} hustle`;
  }

  remove(id: number) {
    return `This action removes a #${id} hustle`;
  }
}
