import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NewspapersService } from './newspapers.service';
import { CreateNewspaperDto } from './dto/create-newspaper.dto';
import { UpdateNewspaperDto } from './dto/update-newspaper.dto';

@Controller('newspapers')
export class NewspapersController {
  constructor(private readonly newspapersService: NewspapersService) { }

  @Post()
  async create(@Body() createNewspaperDto: CreateNewspaperDto) {
    // return this.newspapersService.create(createNewspaperDto);
    return await this.newspapersService.create(createNewspaperDto);
  }

  @Get()
  findAll() {
    return this.newspapersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newspapersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewspaperDto: UpdateNewspaperDto) {
    return this.newspapersService.update(+id, updateNewspaperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newspapersService.remove(+id);
  }
}
