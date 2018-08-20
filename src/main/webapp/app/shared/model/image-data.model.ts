import { ICard } from 'app/shared/model//card.model';

export interface IImageData {
  id?: number;
  frontImageContentType?: string;
  frontImage?: any;
  backImageContentType?: string;
  backImage?: any;
  card?: ICard;
}

export const defaultValue: Readonly<IImageData> = {};
