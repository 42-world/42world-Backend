import { ArticleResponseDto } from '@api/article/dto/response/article-response.dto';
import { CategoryResponseDto } from '@api/category/dto/response/category-response.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';

describe('ArticleResponseDto', () => {
  it('Dto 가 잘 생성된다.', async () => {
    const articleResponseDto: ArticleResponseDto = new ArticleResponseDto({
      id: 1,
      title: '제목 입니다.',
      content: '내용 입니다.',
      viewCount: 1,
      categoryId: 1,
      category: new CategoryResponseDto({
        id: 1,
        name: '카테고리 이름 입니다.',
        isArticleReadable: true,
        isArticleWritable: true,
        isCommentReadable: true,
        isCommentWritable: true,
        isAnonymous: true,
        isReactionable: true,
      }),
      writerId: 1,
      writer: new UserResponseDto({
        id: 1,
        nickname: '닉네임 입니다.',
        role: UserRole.CADET,
        character: 0,
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
      }),
      commentCount: 1,
      likeCount: 1,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-01'),
      isSelf: false,
      isLike: false,
    });

    expect(articleResponseDto).toMatchInlineSnapshot(`
      ArticleResponseDto {
        "category": CategoryResponseDto {
          "id": 1,
          "isAnonymous": true,
          "isArticleReadable": true,
          "isArticleWritable": true,
          "isCommentReadable": true,
          "isCommentWritable": true,
          "isReactionable": true,
          "name": "카테고리 이름 입니다.",
        },
        "categoryId": 1,
        "commentCount": 1,
        "content": "내용 입니다.",
        "createdAt": 2022-01-01T00:00:00.000Z,
        "id": 1,
        "isLike": false,
        "isSelf": false,
        "likeCount": 1,
        "title": "제목 입니다.",
        "updatedAt": 2022-01-01T00:00:00.000Z,
        "viewCount": 1,
        "writer": UserResponseDto {
          "character": 0,
          "createdAt": 2022-01-01T00:00:00.000Z,
          "id": 1,
          "nickname": "닉네임 입니다.",
          "role": "CADET",
          "updatedAt": 2022-01-01T00:00:00.000Z,
        },
        "writerId": 1,
      }
    `);
  });
});
