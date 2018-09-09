import { Moment } from 'moment';
import { IUserExtra } from 'app/shared/model//user-extra.model';

export interface IUserProgress {
  id?: number;
  day?: Moment;
  dailyRepetitions?: number;
  userExtra?: IUserExtra;
}

export const defaultValue: Readonly<IUserProgress> = {};
