import { Injectable } from '@nestjs/common';
import { CreateBestDto } from './dto/create-best.dto';
import { UpdateBestDto } from './dto/update-best.dto';

@Injectable()
export class BestService {
  create(createBestDto: CreateBestDto) {
    return 'This action adds a new best';
  }

  findAll() {
    return `This action returns all best`;
  }

  findOne(id: number) {
    return `This action returns a #${id} best`;
  }

  update(id: number, updateBestDto: UpdateBestDto) {
    return `This action updates a #${id} best`;
  }

  remove(id: number) {
    return `This action removes a #${id} best`;
  }
}
