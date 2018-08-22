import { ICard } from 'app/shared/model//card.model';

export interface ITag {
  id?: number;
  name?: string;
  card?: ICard;
}

export const defaultValue: Readonly<ITag> = {};
