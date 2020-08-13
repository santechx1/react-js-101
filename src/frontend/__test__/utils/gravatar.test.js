import gravatar from '../../utils/gravatar';

test('Gravatar Function', () => {
  const email = 'santiagogf11@gmail.com';
  const gravatarUrl = 'https://gravatar.com/avatar/e80bbf295fd875b0e109958d7b198c7b';
  expect(gravatarUrl).toEqual(gravatar(email));
});
