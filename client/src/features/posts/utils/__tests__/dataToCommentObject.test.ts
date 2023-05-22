import dataToCommentObject from '../dataToCommentObject';
import { MOCKS } from '../../../../utils/test_utils';
import { CommentInterface } from '../../types/Comment';

test('Function returns proper comment', () => {
  const comment: CommentInterface = dataToCommentObject({
    id: 'test',
    _id: 'test',
    author: { ...MOCKS.USER, _id: MOCKS.USER.id },
    body: 'Test body',
    likes: [],
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2020-01-01'),
    post: MOCKS.POST.id,
  });

  expect(comment).toMatchObject({
    id: 'test',
    author: MOCKS.USER,
    body: 'Test body',
    likes: [],
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2020-01-01'),
    post: MOCKS.POST.id,
  });
});
