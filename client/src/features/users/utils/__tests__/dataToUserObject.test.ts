import dataToUserObject from '../dataToUserObject';
import { MOCKS } from '../../../../utils/test_utils';
import { UserInterface } from '../../types/user';

test('Function returns proper user', () => {
  const user: UserInterface = dataToUserObject({
    ...MOCKS.USER,
    _id: MOCKS.USER.id,
  });

  expect(user).toMatchObject(MOCKS.USER);
});
