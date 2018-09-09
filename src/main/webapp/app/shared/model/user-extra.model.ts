import { IUser } from './user.model';
import { ICard } from 'app/shared/model//card.model';
import { ICategory } from 'app/shared/model//category.model';
import { IUserProgress } from 'app/shared/model//user-progress.model';

export interface IUserExtra {
  id?: number;
  user?: IUser;
  cards?: ICard[];
  categories?: ICategory[];
  userProgresses?: IUserProgress[];
}

export const defaultValue: Readonly<IUserExtra> = {};
