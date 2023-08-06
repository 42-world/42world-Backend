import { Plain } from '@app/common/types/plain';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { SearchArticleRequestDto } from '../search-article-request.dto';

describe('SearchArticleRequestDto', () => {
  const plain: Plain<SearchArticleRequestDto> = {
    take: '1',
    page: '1',
    order: 'DESC',
    q: '검색할 단어',
    categoryId: '1',
  };

  it('Dto 가 잘 생성된다.', async () => {
    const obj = plainToInstance(SearchArticleRequestDto, plain);

    const result = validateSync(obj);

    expect(result.length).toBe(0);
  });
});
