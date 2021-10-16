// Промокод действует только на акционные товары
// У блогера должен быть промокод для каждой акции отдельно
// Промокод можно создавать вручную (вписавать значение кода вручную. не менее 4 символов) или генерировать. Валидировать пересечения промокодов

import { AssetModel, ObjectIdModel } from 'db/dbModels';

// Промокод
export interface PromoCodeModel {
  _id: ObjectIdModel;
  code: string;
  active: boolean;
  promoId: ObjectIdModel;
  promoterId?: ObjectIdModel;
  paybackPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

// Акция
export interface PromoModel {
  _id: ObjectIdModel;
  shopId: ObjectIdModel;
  companyId: ObjectIdModel;
  discountPercent: number; // ???
  cashbackPercent: number; // ???
  nameI18n: any;
  descriptionI18n?: any;

  // ui configs
  showAsPromoPage?: boolean | null;
  assetKeys: string[];
  content: string; // constructor
  mainBanner?: AssetModel | null;
  mainBannerMobile?: AssetModel | null;
  showAsMainBanner?: boolean | null;
  mainBannerTextColor?: string | null;
  mainBannerVerticalTextAlign?: string | null;
  mainBannerHorizontalTextAlign?: string | null;
  mainBannerTextAlign?: string | null;
  mainBannerTextPadding?: number | null;
  mainBannerTextMaxWidth?: number | null;
  secondaryBanner?: AssetModel | null;
  showAsSecondaryBanner?: boolean | null;
  secondaryBannerTextColor?: string | null;
  secondaryBannerVerticalTextAlign?: string | null;
  secondaryBannerHorizontalTextAlign?: string | null;
  secondaryBannerTextAlign?: string | null;
  secondaryBannerTextPadding?: number | null;
  secondaryBannerTextMaxWidth?: number | null;

  // dates
  createdAt: Date;
  updatedAt: Date;
  startAt: Date;
  endAt: Date;
}

// Товары акции
export interface ProductPromoModel {
  _id: ObjectIdModel;
  promoId: ObjectIdModel;
  shopId: ObjectIdModel;
  shopProductId: ObjectIdModel;
}
