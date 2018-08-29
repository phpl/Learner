import { ICard } from 'app/shared/model//card.model';
import { IUserExtra } from 'app/shared/model//user-extra.model';

export interface ICategory {
  id?: number;
  name?: string;
  cards?: ICard[];
  userExtra?: IUserExtra;
}

export const defaultValue: Readonly<ICategory> = {};
