import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentRepository.save(createCommentDto);
  }

  getByArticleId(article_id: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { article_id } });
  }

  async updateContent(id: number, content: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne(id);
    if (!comment) {
      throw new NotFoundException(`Can't find Comment with id ${id}`);
    }

    comment.content = content;
    return this.commentRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.commentRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Comment with id ${id}`);
    }
  }
}
