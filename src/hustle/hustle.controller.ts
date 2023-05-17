import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { HustleService } from './hustle.service';
import { CreateHustleDto } from './dto/create-hustle.dto';
import { UpdateHustleDto } from './dto/update-hustle.dto';
import { Response } from 'express';

@Controller('hustle')
export class HustleController {
  constructor(private readonly hustleService: HustleService) { }

  @Post()
  create(@Body() createHustleDto: CreateHustleDto) {
    return this.hustleService.create(createHustleDto);
  }

  @Get()
  findAll() {
    return this.hustleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hustleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHustleDto: UpdateHustleDto) {
    return this.hustleService.update(+id, updateHustleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hustleService.remove(+id);
  }
}
