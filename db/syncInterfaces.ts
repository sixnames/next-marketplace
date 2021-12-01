import { EmailAddressModel, PhoneNumberModel, TimestampModel } from 'db/dbModels';

export interface SyncParamsInterface {
  apiVersion?: string;
  systemVersion?: string;
  token?: string;
}

export interface GetOrdersParamsInterface extends SyncParamsInterface {
  fromDate: string;
}

export interface SyncProductInterface {
  id?: string | null;
  barcode?: string[] | null;
  available?: number;
  price?: number;
  name: string;
}

export interface SyncBlackListProductInterface {
  id?: string | null;
  products: SyncProductInterface[];
}

export interface SyncResponseInterface {
  success: boolean;
  message: string;
}

export interface SyncOrderProductInterface extends TimestampModel {
  barcode?: string[];
  amount?: number;
  price?: number;
  status?: string;
  name?: string;
}

export interface SyncOrderCustomerInterface {
  name: string;
  lastName?: string | null;
  secondName?: string | null;
  email: EmailAddressModel;
  phone: PhoneNumberModel;
}

export interface SyncUpdateOrderProductInterface extends SyncOrderProductInterface {
  orderId?: string;
}

export interface SyncOrderInterface extends TimestampModel {
  orderId: string;
  shopId: string;
  status: string;
  products: SyncOrderProductInterface[];
  customer?: SyncOrderCustomerInterface;
  reservationDate?: string | null;
}

export interface SyncOrderResponseInterface extends SyncResponseInterface {
  orders: SyncOrderInterface[];
}

export interface SyncOrderStatusInterface {
  _id: string;
  name: string;
}

export interface SyncOrderStatusesResponseInterface extends SyncResponseInterface {
  orderStatuses?: SyncOrderStatusInterface[];
}

export interface SyncShopProductsResponseInterface extends SyncResponseInterface {
  shopProducts: SyncProductInterface[];
}
