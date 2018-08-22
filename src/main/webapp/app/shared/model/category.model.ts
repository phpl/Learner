import { ICard } from 'app/shared/model//card.model';

export interface ICategory {
  id?: number;
  name?: string;
  card?: ICard;
}

export const defaultValue: Readonly<ICategory> = {};
