import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AlsoNovice, GetUser } from '@auth/auth.decorator';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { NotificationService } from '@root/notification/notification.service';
import { ReactionService } from '@root/reaction/reaction.service';
import { ReactionArticle } from '@root/reaction/entities/reaction-article.entity';
import { ArticleService } from '@article/article.service';
import { CommentService } from '@comment/comment.service';
import { Article } from '@article/entities/article.entity';
import { Comment } from '@comment/entities/comment.entity';
import { ApiPaginatedResponse } from '@root/pagination/pagination.decorator';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-profile-request.dto';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@root/pagination/dto/pagination-response.dto';
import { ArticleResponseDto } from '@root/article/dto/response/article-response.dto';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly reactionService: ReactionService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: '내 정보 가져오기' })
  @ApiOkResponse({ description: '내 정보', type: UserResponseDto })
  getOne(@GetUser() user: User): UserResponseDto {
    return UserResponseDto.of({ user });
  }

  // TODO: profile API는 me 와 합칠것
  @Get('profile')
  @AlsoNovice()
  @ApiOperation({ summary: '내 정보 가져오기 (42인증 안된 사람도 가능)' })
  @ApiOkResponse({ description: '내 정보', type: UserResponseDto })
  getProfile(@GetUser() user: User): UserResponseDto {
    return UserResponseDto.of({ user });
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiOkResponse({ description: '유저 정보', type: UserResponseDto })
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.userService.getOne(id);

    return UserResponseDto.of({ user });
  }

  @Put()
  @ApiOperation({ summary: '유저 프로필 변경' })
  @ApiOkResponse({ description: '변경된 정보', type: UserResponseDto })
  async update(
    @GetUser() user: User,
    @Body() updateUserProfileDto: UpdateUserProfileRequestDto,
  ): Promise<UserResponseDto> {
    const newUser = await this.userService.updateProfile(
      user,
      updateUserProfileDto,
    );

    return UserResponseDto.of({ user: newUser });
  }

  @Delete()
  @ApiOperation({ summary: '유저 삭제' })
  @ApiOkResponse({ description: '유저 삭제 성공' })
  remove(@GetUser('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Get('me/like-articles')
  @ApiOperation({ summary: '유저가 좋아요 누른 게시글 목록 확인' })
  @ApiPaginatedResponse(ReactionArticle)
  findAllReactionArticle(
    @GetUser('id') userId: number,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ReactionArticle>> {
    return this.reactionService.findAllArticleByUserId(userId, options);
  }

  @Get('me/articles')
  @ApiOperation({ summary: '내가 작성한 글' })
  @ApiPaginatedResponse(Article)
  async findAllMyArticle(
    @GetUser('id') userId: number,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<Article>> {
    const { articles, totalCount } = await this.articleService.findAllMyArticle(
      userId,
      options,
    );
    return PaginationResponseDto.of({
      data: ArticleResponseDto.ofArray({
        articles,
        userId,
      }),
      options,
      totalCount,
    });
  }

  @Get('me/comments')
  @ApiOperation({ summary: '내가 작성한 댓글' })
  @ApiPaginatedResponse(Comment)
  findAllMyComment(
    @Query() options: PaginationRequestDto,
    @GetUser('id') id: number,
  ): Promise<PaginationResponseDto<Comment>> {
    return this.commentService.findAllMyComment(id, options);
  }
}
