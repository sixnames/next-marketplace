import { TimestampModel } from 'db/dbModels';

export interface SyncParamsInterface {
  apiVersion?: string;
  systemVersion?: string;
  token?: string;
}

export interface SyncProductInterface {
  barcode?: string;
  available?: number;
  price?: number;
}

export interface SyncResponseInterface {
  success: boolean;
  message: string;
}

export interface SyncOrderProductInterface extends TimestampModel {
  barcode?: string;
  amount?: number;
  price?: number;
  status?: string; // TODO order status type
}

export interface SyncUpdateOrderProductInterface extends SyncOrderProductInterface {
  orderId?: string;
}

export interface SyncOrderInterface extends TimestampModel {
  orderId: string;
  shopId: string;
  status: string; // TODO order status type
  products: SyncOrderProductInterface[];
}

export interface SyncOrderResponseInterface {
  success: boolean;
  message: string;
  orders: SyncOrderInterface[];
}
