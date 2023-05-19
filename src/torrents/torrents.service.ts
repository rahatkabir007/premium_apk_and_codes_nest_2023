import { Injectable } from '@nestjs/common';
import { CreateTorrentDto } from './dto/create-torrent.dto';
import { UpdateTorrentDto } from './dto/update-torrent.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TORRENT, TORRENTDocument } from './schemas/torrent.schema';
import { DATABASE_CONNECTION } from 'src/utils/DatabaseConstants';
import { Model } from 'mongoose';
import { torrentScrappingPageNumber } from 'src/utils/TorrentScrapping/TorrentScrappingPageNumber';
import { torrenScrappingAllItems } from 'src/utils/TorrentScrapping/TorrentScrappingAllItem';
import { torrentScrappingSingleItem } from 'src/utils/TorrentScrapping/TorrentScrappingSingleItem';


var isWorking = false;
@Injectable()
export class TorrentsService {
  constructor(
    @InjectModel(TORRENT.name, DATABASE_CONNECTION.TORRENTS)
    private torrentModel: Model<TORRENTDocument>
    // eslint-disable-next-line no-empty-function
  ) { }

  createTorrentDatas(res) {
    if (isWorking) {
      return res.status(409).json({ message: 'Work in progress' });
    }
    isWorking = true
    res.send('Scrapping Initiated');
    console.log("route hit");
    setTimeout(async () => {
      try {
        console.log('Timeout hit');
        const torrentLastDate = await this.torrentModel.find().sort({ createdDate: -1 })
        const torrentLastDt = torrentLastDate[0]?.created || ''

        const lastPScrap = await this.torrentModel.find().sort({ page: 1 })
        const firstPScrap = await this.torrentModel.find().sort({ page: -1 })
        const lastPageScrap = lastPScrap[0]?.page || 0
        const firstPageScrap = firstPScrap[0]?.page || 0
        const pageGap = (firstPageScrap - lastPageScrap) || 0
        const { totalP, page } = await torrentScrappingPageNumber();
        console.log('total', totalP)

        let allReadMoreHref;
        // for (let i = totalP - pageGap; i >= 1; i--) {
        for (let i = totalP - pageGap; i >= 1; i--) {
          const result: any = await torrenScrappingAllItems(page, torrentLastDt, i);
          if (result === "continue") {
            continue;
          }
          allReadMoreHref = result;
          if (allReadMoreHref.length === 0) {
            break;
          }
          console.log('allReadMoreHref', allReadMoreHref)
          let torrentObjArray = [];
          for (let j = allReadMoreHref.length - 1; j >= 0; j--) {
            const objResult: any = await torrentScrappingSingleItem(page, torrentLastDate, allReadMoreHref, j);
            if (objResult === "continue") {
              continue;
            }
            console.log("🚀 ~ file: codes.service.ts:98 ~ CodesService ~ setTimeout ~ objResult:", objResult)
            objResult.page = i
            console.log('objResult', objResult)
            torrentObjArray.push(objResult)
          }

          console.log("torrentObjArray", torrentObjArray)
          const promises = torrentObjArray.map(async (data) => {
            await this.torrentModel.findOneAndUpdate({ title: data.title }, data, { upsert: true, new: true });
          });

          await Promise.all(promises);
          console.log('DB insert', i, "page");
        }
        // const result:any = await apkScrapping(apkLastDt); // Call the main function and capture the return value


        // const promises = result.map(async (data) => {
        //   await this.apkModel.findOneAndUpdate({ title: data.title }, data, { upsert: true, new: true });
        // });

        // await Promise.all(promises);
        console.log('DB insert');
        isWorking = false
        return "Inserted to DB"

      } catch (error) {
        console.error(error);
        isWorking = false;
        res.status(500).send('Error occurred during scraping');
      }
    }, 3000);
  }

  async findAllTorrentData(query: { page: number }) {
    console.log('query', query.page)
    const limit = 8;
    const page = query.page;
    const torrentAllData = await this.torrentModel.find().sort({ createdDate: -1 }).limit(limit).skip(((page as number) - 1) * (limit))
    const torrentAllDataLength = (await this.torrentModel.find().sort({ createdDate: -1 }).count())
    console.log('torrentAllDataLength', torrentAllDataLength)
    console.log('torrentAllData', torrentAllData)
    return { torrentAllData, torrentAllDataLength }
  }


  async findAllTorrentDataSearch(query: { search: string, page: number }) {
    console.log('query', query.search)
    console.log('page', query.page)
    const limit = 8;
    const searchValue = query.search;
    const page = query.page;
    const torrentAllDataSearch = await this.torrentModel.find({ "title": { $regex: searchValue, $options: 'i' } }).limit(limit).skip(((page as number) - 1) * (limit))
    const torrentAllDataLengthSearch = await this.torrentModel.find({ "title": { $regex: searchValue, $options: 'i' } }).count()
    // const catSubLastObj = await this.apkModel.findOne({title:null});
    // const catSub=catSubLastObj.catSub
    console.log('apkAllDataLenght', torrentAllDataLengthSearch)
    console.log('torrentAllDataSearch', torrentAllDataSearch)
    return { torrentAllDataSearch, torrentAllDataLengthSearch }
  }

  async findAllCategorizedTorrent(query: { category: string, page: number, subCat: string }) {
    const limit = 8;
    const apkValue = query.category;
    const page = query.page;
    const subCat = query.subCat || ''
    console.log('subCat', subCat, apkValue, page);
    const categorizedTorrent = await this.torrentModel.find({
      "categories": { $regex: `.*${apkValue}.*${subCat}|.*${subCat}.*${apkValue}.*`, $options: 'i' }
      // "categories": { $regex: `.*${apkValue}.* `&& `.*${subCat}.*`, $options: 'i' },
      // "categories": { $regex: subCat, $options: 'i' } ,
    }).limit(limit).skip(((page as number) - 1) * (limit))

    const torrentAllDataLengthCategorized = await this.torrentModel.find({
      "categories": { $regex: `.*${apkValue}.*${subCat}|.*${subCat}.*${apkValue}.*`, $options: 'i' }
      // "categories": { $regex: `.*${apkValue}.*` && `.*${subCat}.*`, $options: 'i' },
      // "categories": { $regex: subCat, $options: 'i' } ,
    }).count()
    // const pageCountNumber = Math.ceil(categorizedCodesLength / limit)
    // const catSubLastObj = await this.apkModel.findOne({title:null});
    // const catSub = catSubLastObj.catSub
    console.log('categorizedTorrent', categorizedTorrent)
    console.log('torrentAllDataLengthCategorized', torrentAllDataLengthCategorized)
    return { categorizedTorrent, torrentAllDataLengthCategorized }
  }

  async findAllTagTorrent(query: { tag: string, page: number }) {
    const limit = 8;
    const apkValue = query.tag;
    const page = query.page;
    console.log('subCat', apkValue, page);
    const tagTorrent = await this.torrentModel.find({
      tags: { $regex: apkValue, $options: 'i' }
      // "tags": { $regex: `.*${apkValue}.*`, $options: 'i' }
      // "categories": { $regex: `.*${apkValue}.* `&& `.*${subCat}.*`, $options: 'i' },
      // "categories": { $regex: subCat, $options: 'i' } ,
    }).limit(limit).skip(((page as number) - 1) * (limit))

    const torrentAllDataLengthTag = await this.torrentModel.find({
      tags: { $regex: apkValue, $options: 'i' }
      // "tags": { $regex: `.*${apkValue}.*`, $options: 'i' }
      // "categories": { $regex: `.*${apkValue}.*` && `.*${subCat}.*`, $options: 'i' },
      // "categories": { $regex: subCat, $options: 'i' } ,
    }).count()
    // const pageCountNumber = Math.ceil(categorizedCodesLength / limit)
    // const catSubLastObj = await this.apkModel.findOne({title:null});
    // const catSub = catSubLastObj.catSub
    console.log('tagTorrent', tagTorrent)
    console.log('torrentAllDataLengthTag', torrentAllDataLengthTag)
    return { tagTorrent, torrentAllDataLengthTag }
  }

  async findOneTorrent(id: string) {
    const torrentOne = await this.torrentModel.findOne({ _id: id })
    return { torrentOne }
  }


  findOne(id: number) {
    return `This action returns a #${id} torrent`;
  }

  update(id: number, updateTorrentDto: UpdateTorrentDto) {
    return `This action updates a #${id} torrent`;
  }

  remove(id: number) {
    return `This action removes a #${id} torrent`;
  }
}
