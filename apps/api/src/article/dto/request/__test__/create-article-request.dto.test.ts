import { Plain } from '@app/common/types/plain';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateArticleRequestDto } from '../create-article-request.dto';

describe('CreateArticleRequestDto', () => {
  const plain: Plain<CreateArticleRequestDto> = {
    title: '제목 입니다.',
    content: '내용 입니다.',
    categoryId: '1',
  };

  it('Dto 가 잘 생성된다.', async () => {
    const obj = plainToInstance(CreateArticleRequestDto, plain);

    const result = validateSync(obj);

    expect(result.length).toBe(0);
  });
});
