import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApksService } from './apks.service';
import { CreateApkDto } from './dto/create-apk.dto';
import { UpdateApkDto } from './dto/update-apk.dto';

@Controller('apks')
export class ApksController {
  constructor(private readonly apksService: ApksService) { }


  @Post('/test')
  test(@Body() createApk: CreateApkDto) {
    return this.apksService.create(createApk);
  }


  @Post()
  create(@Body() createApkDto: CreateApkDto) {
    return this.apksService.create(createApkDto);
  }

  @Get()
  findAll() {
    return this.apksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apksService.findOne(+id);
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
