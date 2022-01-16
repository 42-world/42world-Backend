import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BestService } from './best.service';
import { CreateBestDto } from './dto/create-best.dto';
import { UpdateBestDto } from './dto/update-best.dto';

@Controller('best')
export class BestController {
  constructor(private readonly bestService: BestService) {}

  @Post()
  create(@Body() createBestDto: CreateBestDto) {
    return this.bestService.create(createBestDto);
  }

  @Get()
  findAll() {
    return this.bestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBestDto: UpdateBestDto) {
    return this.bestService.update(+id, updateBestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bestService.remove(+id);
  }
}
