import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { CodesService } from './codes.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { Response } from 'express';

let isWorking = false;
@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) { }


  @Post('/postCodes')
  postCodes(@Res() res: Response) {
    if (isWorking) {
      return res.status(409).json({ message: 'Work in progress' });
    }
    isWorking = true
    return this.codesService.createCodeDatas(res, isWorking);
  }

  @Get('/findAllCodesPaginated')
  findAllCodesPaginated(@Query() queries: { page: number }) {
    console.log("🚀 ~ file: codes.controller.ts:21 ~ CodesController ~ findAllCodes ~ queries:", queries)
    return this.codesService.findAllCodeDatas(queries);
  }

  @Get('/findTrendingCodes')
  findTrendingCodes() {
    return this.codesService.findTrendingCodes()
  }

  @Get('/findAllSearchCodes')
  async findAllSearchCodes(@Query() queries: { search: string, page: number }) {
    return await this.codesService.findAllSearchCodes(queries);
  }

  @Get('/findAllCategorizedCodes')
  async findAllCategorizedCodes(@Query() queries: { category: string, page: number }) {
    return await this.codesService.findAllCategorizedCodes(queries);
  }

  @Get('/findOneCode/:id')
  findOneCode(@Param('id') id: string) {
    return this.codesService.findOneCodeData(id);
  }

  @Post()
  create(@Body() createCodeDto: CreateCodeDto) {
    return this.codesService.create(createCodeDto);
  }



  @Get()
  findAll() {
    return this.codesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCodeDto: UpdateCodeDto) {
    return this.codesService.update(+id, updateCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codesService.remove(+id);
  }
}
