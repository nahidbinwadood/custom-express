import { IUser } from '../types';

export const generateNewId = (users: IUser[]) => {
  const maxId = users?.reduce((acc: number, user: IUser) => {
    return acc < user?.id ? user?.id : acc;
  }, 0);
  return maxId + 1;
};
