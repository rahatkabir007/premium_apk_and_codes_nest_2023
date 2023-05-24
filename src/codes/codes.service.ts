import { Injectable } from '@nestjs/common';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Code, CodeDocument } from './schemas/code.schema';
import { Model } from 'mongoose';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
import { codeScrappingPageNumber } from 'src/utils/CodeScrapping/CodeScrappingPageNumber';
import { codeScrappingAllItems } from 'src/utils/CodeScrapping/CodeScrappingAllItems';
import { codeScrappingSingleItem } from 'src/utils/CodeScrapping/CodeScrappingSingleItem';


export interface codeDataType {
  title: string;
  description: string;
  img: string;
  category: string;
  date: string;
  downloadLinks: string[];
  page: number
}
var isWorking = false;
@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Code.name, DATABASE_CONNECTION.CODE)
    private codeModel: Model<CodeDocument>
    // eslint-disable-next-line no-empty-function
  ) { }


  async createCodeDatas(res) {
    if (isWorking) {
      return res.status(409).json({ message: 'Work in progress' });
    }
    isWorking = true
    res.send('Scrapping Initiated');
    console.log("route hit");
    setTimeout(async () => {
      try {
        console.log('Set Timeout hit');
        const codeLastDate = await this.codeModel.find().sort({ mongoDbDate: -1 })
        const codeLastDt = codeLastDate[0]?.date || ''
        const lastPScrap = await this.codeModel.find().sort({ page: 1 })
        const firstPScrap = await this.codeModel.find().sort({ page: -1 })
        const lastPageScrap = lastPScrap[0]?.page || 0
        const firstPageScrap = firstPScrap[0]?.page || 0
        let pageGap = (firstPageScrap - lastPageScrap) || 0
        const { lastLinkNumber, page, browser } = await codeScrappingPageNumber();
        console.log("🚀 ~ file: codes.service.ts:87 ~ CodesService ~ setTimeout ~ result:", lastLinkNumber)
        let codeDatas;
        for (let i = lastLinkNumber - pageGap; i >= 1; i--) {
          const result: any = await codeScrappingAllItems(page, codeLastDt, i);
          if (result === "continue") {
            continue;
          }
          codeDatas = result;
          if (codeDatas.length === 0) {
            break;
          }
          let codeObjArray = [];
          for (let j = codeDatas.length - 1; j >= 0; j--) {
            const objResult: any = await codeScrappingSingleItem(page, codeLastDt, codeDatas, j);
            if (objResult === "continue") {
              continue;
            }
            objResult.page = i
            console.log("🚀 ~ file: codes.service.ts:98 ~ CodesService ~ setTimeout ~ objResult:", objResult)
            codeObjArray.push(objResult)
          }
          const promises = codeObjArray.map(async (data) => {
            await this.codeModel.findOneAndUpdate({ title: data.title }, data, { upsert: true, new: true });
          });

          await Promise.all(promises);
          console.log('DB insert', i, "page");
        }
        console.log("🚀 ~ file: codes.service.ts:111 ~ CodesService ~ setTimeout ~ codeDatas:", codeDatas)
        await browser.close();
        // const promises = result.map(async (data) => {
        //   await this.codeModel.findOneAndUpdate({ title: data.title }, data, { upsert: true, new: true });
        // });

        // await Promise.all(promises);
        // for (let i = 0; i < result?.length; i++) {
        //   await this.codeModel.findOneAndUpdate({ title: result[i].title }, result[i], { upsert: true, new: true })
        // }
        console.log('DB insert');
        isWorking = false;
        return "Inserted to DB"
      } catch (error) {
        console.error(error);
        isWorking = false;
        res.status(500).send('Error occurred during scraping');
      }

    }, 3000);

  }

  async findAllCodeDatas(query: { page: number }) {
    let limit = 8;
    // let limit = 10
    const page = query.page || 1;
    // const page = 1;

    const codes = await this.codeModel.find().limit(limit).skip((page as number - 1) * limit).sort({ mongoDbDate: -1 }).exec();
    const totalCodeLength = await this.codeModel.count()
    const pageCountNumber = Math.ceil(totalCodeLength / limit)
    return { codes, pageCountNumber }
  }

  async findTrendingCodes() {
    function getRandomSubset(array, count) {
      const shuffledArray = array.slice(); // Create a copy of the original array
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      return shuffledArray.slice(0, count);
    }

    const allCodes = await this.codeModel.find();
    const codes = getRandomSubset(allCodes, 9);
    return { codes };
  }

  async findAllSearchCodes(query: { search: string, page: number }) {
    const limit = 8;
    const searchValue = query.search;
    const page = query.page;
    const searchedCodes = await this.codeModel.find({ "title": { $regex: searchValue, $options: 'i' } }).limit(limit).skip(((page as number) - 1) * (limit)).sort({ mongoDbDate: -1 });
    const searchedCodesLength = await this.codeModel.find({ "title": { $regex: searchValue, $options: 'i' } }).count()
    const pageCountNumber = Math.ceil(searchedCodesLength / limit)
    return { searchedCodes, pageCountNumber }
  }

  async findAllCategorizedCodes(query: { category: string, page: number }) {
    const limit = 8;
    const categoryValue = query.category;
    const page = query.page;
    const categorizedCodes = await this.codeModel.find({ "category": { $regex: categoryValue, $options: 'i' } }).limit(limit).skip(((page as number) - 1) * (limit)).sort({ mongoDbDate: -1 })
    const categorizedCodesLength = await this.codeModel.find({ "category": { $regex: categoryValue, $options: 'i' } }).count()
    const pageCountNumber = Math.ceil(categorizedCodesLength / limit)
    return { categorizedCodes, pageCountNumber }
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
