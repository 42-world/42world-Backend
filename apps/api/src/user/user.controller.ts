import { ArticleService } from '@api/article/article.service';
import { ArticleResponseDto } from '@api/article/dto/response/article-response.dto';
import { Auth, AuthUser } from '@api/auth/auth.decorator';
import { CommentService } from '@api/comment/comment.service';
import { MyCommentResponseDto } from '@api/comment/dto/response/my-comment-response.dto';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@api/pagination/dto/pagination-response.dto';
import { ApiPaginatedResponse } from '@api/pagination/pagination.decorator';
import { ReactionService } from '@api/reaction/reaction.service';
import { UserProfileResponseDto } from '@api/user/dto/response/user-profile-response.dto';
import { UserProfileMapper } from '@api/user/dto/user-profile.mapper';
import { User } from '@app/entity/user/user.entity';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserProfileRequestDto } from './dto/request/update-user-profile-request.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UserService } from './user.service';

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
  @Auth()
  @ApiOperation({ summary: '내 정보 가져오기' })
  @ApiOkResponse({ description: '내 정보', type: UserProfileResponseDto })
  async me(@AuthUser() user: User): Promise<UserProfileResponseDto> {
    const intraAuth = await user.intraAuth;
    return UserProfileMapper.toMapResponse(user, intraAuth);
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: '특정 유저 정보 가져오기' })
  @ApiOkResponse({ description: '유저 정보', type: UserResponseDto })
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto | never> {
    const user = await this.userService.findOneByIdOrFail(id);

    return UserResponseDto.of({ user });
  }

  @Put()
  @Auth()
  @ApiOperation({ summary: '유저 프로필 변경' })
  @ApiOkResponse({ description: '변경된 정보', type: UserResponseDto })
  @ApiBadRequestResponse({ description: '없는 캐릭터 번호' })
  async update(
    @AuthUser() user: User,
    @Body() updateUserProfileDto: UpdateUserProfileRequestDto,
  ): Promise<UserResponseDto> {
    const newUser = await this.userService.updateProfile(user, updateUserProfileDto);

    return UserResponseDto.of({ user: newUser });
  }

  @Delete()
  @Auth()
  @ApiOperation({ summary: '유저 삭제' })
  @ApiOkResponse({ description: '유저 삭제 성공' })
  async remove(@AuthUser('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Get('me/like-articles')
  @Auth()
  @ApiOperation({ summary: '유저가 좋아요 누른 게시글 목록 확인' })
  @ApiPaginatedResponse(ArticleResponseDto)
  async findAllReactionArticle(
    @AuthUser() user: User,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ArticleResponseDto>> {
    const { likeArticles, totalCount } = await this.reactionService.findAllArticleByUserId(user.id, options);
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
  @Auth()
  @ApiOperation({ summary: '내가 작성한 글' })
  @ApiPaginatedResponse(ArticleResponseDto)
  async findAllMyArticle(
    @AuthUser() user: User,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ArticleResponseDto>> {
    const { articles, totalCount } = await this.articleService.findAllByWriterId(user.id, options);
    return PaginationResponseDto.of({
      data: ArticleResponseDto.ofArray({ articles, user }),
      options,
      totalCount,
    });
  }

  @Get('me/comments')
  @Auth()
  @ApiOperation({ summary: '내가 작성한 댓글' })
  @ApiPaginatedResponse(MyCommentResponseDto)
  async findAllMyComment(
    @AuthUser() user: User,
    @Query() options: PaginationRequestDto,
  ): Promise<PaginationResponseDto<MyCommentResponseDto>> {
    const { comments, totalCount } = await this.commentService.findAllByWriterId(user.id, options);
    return PaginationResponseDto.of({
      data: MyCommentResponseDto.ofArray({ comments, user }),
      options,
      totalCount,
    });
  }
}
