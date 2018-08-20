import { ITextData } from 'app/shared/model//text-data.model';
import { IImageData } from 'app/shared/model//image-data.model';
import { ICardInfo } from 'app/shared/model//card-info.model';
import { ITag } from 'app/shared/model//tag.model';
import { IUserExtra } from 'app/shared/model//user-extra.model';

export interface ICard {
  id?: number;
  textData?: ITextData;
  imageData?: IImageData;
  cardInfo?: ICardInfo;
  tags?: ITag[];
  userExtra?: IUserExtra;
}

export const defaultValue: Readonly<ICard> = {};
