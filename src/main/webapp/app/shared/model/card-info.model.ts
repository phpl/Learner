import { Moment } from 'moment';
import { ICard } from 'app/shared/model//card.model';

export interface ICardInfo {
  id?: number;
  repetitions?: number;
  difficulty?: number;
  daysBetweenReviews?: number;
  dateLastReviewed?: Moment;
  card?: ICard;
}

export const defaultValue: Readonly<ICardInfo> = {};
