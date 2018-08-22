import { Moment } from 'moment';
import { ICategory } from 'app/shared/model//category.model';
import { IUserExtra } from 'app/shared/model//user-extra.model';

export interface ICard {
  id?: number;
  frontText?: string;
  backText?: string;
  frontImageContentType?: string;
  frontImage?: any;
  backImageContentType?: string;
  backImage?: any;
  repetitions?: number;
  difficulty?: number;
  daysBetweenReviews?: number;
  dateLastReviewed?: Moment;
  category?: ICategory;
  userExtra?: IUserExtra;
}

export const defaultValue: Readonly<ICard> = {};
