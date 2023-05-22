import datatoPostObject from '../dataToPostObject';
import { MOCKS } from '../../../../utils/test_utils';
import { PostInterface } from '../../types/Post';

test('Function returns proper post', () => {
  const post: PostInterface = datatoPostObject({
    ...MOCKS.POST,
    _id: MOCKS.POST.id,
    author: { ...MOCKS.POST.author, _id: MOCKS.POST.author.id },
    updatedAt: new Date('2020-01-01'),
  });

  expect(post).toMatchObject({
    ...MOCKS.POST,
    updatedAt: new Date('2020-01-01'),
  });
});
