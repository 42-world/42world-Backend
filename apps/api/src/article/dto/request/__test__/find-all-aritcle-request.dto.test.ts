import { Plain } from '@app/common/types/plain';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { FindAllArticleRequestDto } from '../find-all-article-request.dto';

describe('FindAllArticleRequestDto', () => {
  const plain: Plain<FindAllArticleRequestDto> = {
    take: '1',
    page: '1',
    order: 'DESC',
    categoryId: '1',
  };

  it('Dto 가 잘 생성된다.', async () => {
    const obj = plainToInstance(FindAllArticleRequestDto, plain);

    const result = validateSync(obj);

    expect(result.length).toBe(0);
  });
});
