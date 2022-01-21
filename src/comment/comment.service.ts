import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleService } from '@root/article/article.service';
import { NotificationService } from '@root/notification/notification.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly articleService: ArticleService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    writerId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    // await this.articleService.existOrFail(createCommentDto.articleId);
    const article = await this.articleService.getOne(
      createCommentDto.articleId,
    );
    const comment = await this.commentRepository.save({
      ...createCommentDto,
      writerId,
    });
    await this.notificationService.createNewComment(article, comment); // await 해야할까요?
    return comment;
  }

  getByArticleId(articleId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { article_id: articleId } });
  }

  async updateContent(
    id: number,
    writerId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOneOrFail({
      id,
      writerId,
    });

    comment.content = updateCommentDto.content;
    return this.commentRepository.save(comment);
  }

  async remove(id: number, writerId: number): Promise<void> {
    const result = await this.commentRepository.delete({
      id,
      writerId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Comment with id ${id}`);
    }
  }
}
