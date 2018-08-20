import { ICard } from 'app/shared/model//card.model';

export interface ITag {
  id?: number;
  name?: string;
  cards?: ICard[];
}

export const defaultValue: Readonly<ITag> = {};
