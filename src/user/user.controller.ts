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
import { ReactionService } from '@root/reaction/reaction.service';
import { ArticleService } from '@article/article.service';
import { CommentService } from '@comment/comment.service';
import { ApiPaginatedResponse } from '@root/pagination/pagination.decorator';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-profile-request.dto';
import { PaginationRequestDto } from '@root/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@root/pagination/dto/pagination-response.dto';
import { ArticleResponseDto } from '@root/article/dto/response/article-response.dto';
import { MyCommentResponseDto } from '@root/comment/dto/response/my-comment-response.dto';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly reactionService: ReactionService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: '내 정보 가져오기' })
  @ApiOkResponse({ description: '내 정보', type: UserResponseDto })
  findOne(@GetUser() user: User): UserResponseDto {
    return UserResponseDto.of({ user });
  }

  // TODO: profile API는 me 와 합칠것
  @Get('profile')
  @AlsoNovice()
  @ApiOperation({ summary: '내 정보 가져오기 (42인증 안된 사람도 가능)' })
  @ApiOkResponse({ description: '내 정보', type: UserResponseDto })
  findOneProfile(@GetUser() user: User): UserResponseDto {
    return UserResponseDto.of({ user });
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiOkResponse({ description: '유저 정보', type: UserResponseDto })
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto | never> {
    const user = await this.userService.findOneByIdOrFail(id);

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
  @ApiPaginatedResponse(ArticleResponseDto)
  async findAllReactionArticle(
    @GetUser() user: User,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ArticleResponseDto>> {
    const { likeArticles, totalCount } =
      await this.reactionService.findAllArticleByUserId(user.id, options);
    return PaginationResponseDto.of({
      data: ArticleResponseDto.ofArray({
        articles: likeArticles.map((e) => e.article),
        user,
      }),
      options,
      totalCount,
    });
  }

  @Get('me/articles')
  @ApiOperation({ summary: '내가 작성한 글' })
  @ApiPaginatedResponse(ArticleResponseDto)
  async findAllMyArticle(
    @GetUser() user: User,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ArticleResponseDto>> {
    const { articles, totalCount } =
      await this.articleService.findAllByWriterId(user.id, options);
    return PaginationResponseDto.of({
      data: ArticleResponseDto.ofArray({ articles, user }),
      options,
      totalCount,
    });
  }

  @Get('me/comments')
  @ApiOperation({ summary: '내가 작성한 댓글' })
  @ApiPaginatedResponse(MyCommentResponseDto)
  async findAllMyComment(
    @GetUser() user: User,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<MyCommentResponseDto>> {
    const { comments, totalCount } =
      await this.commentService.findAllByWriterId(user.id, options);
    return PaginationResponseDto.of({
      data: MyCommentResponseDto.ofArray({ comments, user }),
      options,
      totalCount,
    });
  }
}
