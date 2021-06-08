export interface SyncParamsInterface {
  apiVersion?: string;
  systemVersion?: string;
  token?: string;
}

export interface InitialSyncProductInterface {
  barcode?: string;
  available?: number;
  price?: number;
}

export interface SyncResponseInterface {
  success: boolean;
  message: string;
}
