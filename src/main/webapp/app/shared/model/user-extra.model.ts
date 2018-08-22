import { IUser } from './user.model';
import { ICard } from 'app/shared/model//card.model';

export interface IUserExtra {
  id?: number;
  user?: IUser;
  cards?: ICard[];
}

export const defaultValue: Readonly<IUserExtra> = {};
