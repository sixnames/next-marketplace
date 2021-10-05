// Промокод действует только на акционные товары
// У блогера должен быть промокод для каждой акции отдельно
// Промокод можно создавать вручную (вписавать значение кода вручную. не менее 4 символов) или генерировать. Валидировать пересечения промокодов

import { AssetModel } from 'db/dbModels';

// Промокод
export interface PromoCodeModel {
  _id: string;
  code: string;
  active: boolean;
  promoId: string;
  promoterId?: string;
  paybackPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

// Акция
export interface PromoModel {
  _id: string;
  shopId: string;
  discountPercent: number;
  cashbackPercent: number;
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
  _id: string;
  promoId: string;
  shopId: string;
  shopProductId: string;
}

// Order
export interface OrderModel {
  promoId: string;
}

// Promoter category
export interface PromoterCategoryModel {
  _id: string;
  nameI18n: any;
  descriptionI18n?: any;
  discountPercent: number;
  paybackPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

// User category
export interface UserCategoryModel {
  _id: string;
  nameI18n: any;
  entryMinCharge: number;
  descriptionI18n?: any;
  discountPercent: number;
  cashbackPercent: number;
  payFromCashbackPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPaybackModel {
  _id: string;
  userId: string;
  orderId?: string;
  creatorId?: string;
  variant: 'add' | 'subtract';
  descriptionI18n?: any;
  value: number; // - / +
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCashbackModel {
  _id: string;
  userId: string;
  orderId?: string;
  creatorId?: string;
  variant: 'add' | 'subtract';
  descriptionI18n?: any;
  value: number; // - / +
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductModel {
  userCategoryDiscount?: boolean | null;
  userCategoryCashback?: boolean | null;
  userCategoryPayFromCashback?: boolean | null;
}

// Add userCategoryId to the UserModel
export interface UserModel {
  userCategoryId?: string;
  usedPromoCodes?: string[];
}
