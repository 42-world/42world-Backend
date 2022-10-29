import { Plain } from '@app/common/types/plain';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { UpdateArticleRequestDto } from '../update-article-request.dto';

describe('UpdateArticleRequestDto', () => {
  const plain: Plain<UpdateArticleRequestDto> = {
    title: '제목 입니다.',
    content: '내용 입니다.',
    categoryId: '1',
  };

  it('Dto 가 잘 생성된다.', async () => {
    const obj = plainToInstance(UpdateArticleRequestDto, plain);

    const result = validateSync(obj);

    expect(result.length).toBe(0);
  });
});
