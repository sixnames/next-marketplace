// indexes !!!!!!!!!!!!

// Промокод действует только на акционные товары
// У блогера должен быть промокод для каждой акции отдельно
// Промокод можно создавать вручную или генерировать. Валидировать пересечения промокодов
export interface PromoCodeModel {
  _id: string;
  code: string;
  promoId: string;
  userId: string;
}

export interface PromoModel {
  _id: string;
  discountPercent: number;
  cashbackPercent: number;
  paybackPercent: number;
  nameI18n: any;
  descriptionI18n?: any;
  usePromo: boolean;
  createdAt: Date;
  updatedAt: Date;
  startAt: Date;
  endAt: Date;
  // assets
}

export interface ProductPromoModel {
  _id: string;
  promoId: string;
  productId: string;
  productSlug: string;
  createdAt: Date;
  updatedAt: Date;
}

// add PromoModel to the OrderModel

// User category
export interface UserCategoryModel {
  _id: string;
  nameI18n: any;
  descriptionI18n?: any;
  discountPercent: number;
  cashbackPercent: number;
  payFromCashbackPercent: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductModel {
  userCategoryDiscount?: boolean | null;
  userCategoryCashback?: boolean | null;
  userCategoryPayFromCashback?: boolean | null;
}

// Add userCategoryId to the UserModel
