import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { CodesService } from './codes.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { Response } from 'express';


@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) { }


  @Post('/postCodes')
  async postCodes(@Res() res: Response) {
    return await this.codesService.createCodeDatas(res);
  }
  @Get('/findAllSEOContents')
  findAllSEOContents() {
    return this.codesService.findAllSEOContents()
  }
  @Get('/findAllCodesPaginated')
  findAllCodesPaginated(@Query() queries: { page: number }) {
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

}
