export const alex = {
  name: 'Alex',
  phone: '+78889990011',
  email: 'alex@gmail.com',
  password: 'Secret12',
};

export const max = {
  name: 'Max',
  phone: '+78889990022',
  email: 'max@gmail.com',
  password: 'Password12',
};

export const users = ['Mark', 'Jane', 'Rick'].map((name: string, i) => ({
  name: name,
  phone: `+7888999009${i}`,
  email: `${name}@example.com`,
  password: 'Password12',
}));
