import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { ApksService } from './apks.service';
import { CreateApkDto } from './dto/create-apk.dto';
import { UpdateApkDto } from './dto/update-apk.dto';
import { Response } from 'express';
let isWorking = false;

@Controller('apks')
export class ApksController {
  constructor(private readonly apksService: ApksService) { }


  @Post('/test')
async test(@Res() res: Response,@Query() queries: {page:number}) {
    if (isWorking) {
      //@ts-ignore
    return res.status(409).json({ message: 'Work in progress' });
  }
  isWorking = true
    return await this.apksService.create(res,isWorking, queries);
  }

  // @Post('/test')
  // test(@Body() createApk: CreateApkDto) {
  //   return this.apksService.create(createApk);
  // }


  // @Post('/')
  // async create(@Res() res: Response) {
  //   if (isWorking) {
  //     //@ts-ignore
  //   return res.status(409).json({ message: 'Work in progress' });
  // }
  // isWorking = true
  //   return await this.apksService.create(res,isWorking);
  // }

  @Get('/findAllApk')
  async findAllApkCd( @Query() queries: {page:number}) {
    return await this.apksService.findAllApkData(queries);
  }

  @Get('/findAllApkSearch')
  async findAllApkS( @Query() queries: {search:string, page:number}) {
    return await this.apksService.findAllApkDataSearch(queries);
  }

  @Get('/findAllCategorizedApk')
  async findAllCategorizedCodes(@Query() queries: { category: string, page: number,subCat:string }) {
    return await this.apksService.findAllCategorizedApk(queries);
  }

  @Get('/findOneApk/:id')
  findOne(@Param('id') id: string) {
    return this.apksService.findOneApk(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApkDto: UpdateApkDto) {
    return this.apksService.update(+id, updateApkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apksService.remove(+id);
  }
}
