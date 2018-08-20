import { ICard } from 'app/shared/model//card.model';

export interface ITextData {
  id?: number;
  frontText?: string;
  backText?: string;
  card?: ICard;
}

export const defaultValue: Readonly<ITextData> = {};
