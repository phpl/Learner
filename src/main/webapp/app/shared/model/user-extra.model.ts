import { IUser } from './user.model';
import { ICard } from 'app/shared/model//card.model';
import { ICategory } from 'app/shared/model//category.model';

export interface IUserExtra {
  id?: number;
  user?: IUser;
  cards?: ICard[];
  categories?: ICategory[];
}

export const defaultValue: Readonly<IUserExtra> = {};
