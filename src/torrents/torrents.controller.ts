import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { TorrentsService } from './torrents.service';
import { CreateTorrentDto } from './dto/create-torrent.dto';
import { UpdateTorrentDto } from './dto/update-torrent.dto';
import { Response } from 'express';

@Controller('torrents')
export class TorrentsController {
  constructor(private readonly torrentsService: TorrentsService) { }

  @Post('/fetchAll')
  async test(@Res() res: Response) {
    await this.torrentsService.createTorrentDatas(res);
  }

  @Post('/fetch')
  async test2(@Res() res: Response) {
    await this.torrentsService.fetchTorrentDatas(res);
  }

  @Get('/findAllTorrent')
  async findAllTorrentCd(@Query() queries: { page: number }) {
    return await this.torrentsService.findAllTorrentData(queries);
  }

  @Get('/findAllTorrentSiteMp')
  async findAllTorrentSM() {
    return await this.torrentsService.findAllTorrentDataSiteMap();
  }

  @Get('/findAllTorrentSearch')
  async findAllTorrentS(@Query() queries: { search: string, page: number }) {
    return await this.torrentsService.findAllTorrentDataSearch(queries);
  }

  @Get('/findAllCategorizedTorrent')
  async findAllCategorizedTorrent(@Query() queries: { category: string, page: number, subCat: string }) {
    return await this.torrentsService.findAllCategorizedTorrent(queries);
  }

  @Get('/findAllTagTorrent')
  async findAllCTagTorrent(@Query() queries: { tag: string, page: number }) {
    return await this.torrentsService.findAllTagTorrent(queries);
  }

  @Get('/findOneTorrent/:id')
  findOne(@Param('id') id: string) {
    return this.torrentsService.findOneTorrent(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTorrentDto: UpdateTorrentDto) {
    return this.torrentsService.update(+id, updateTorrentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.torrentsService.remove(+id);
  }
}
