import {
  SUPPLIER_PRICE_VARIANT_DISCOUNT,
  SUPPLIER_PRICE_VARIANT_CHARGE,
} from '../../../config/common';
import { SupplierProductModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const supplierProducts: SupplierProductModel[] = [
  {
    _id: getObjectId('supplier product A'),
    supplierId: getObjectId('supplier Supplier A'),
    companyId: getObjectId('company Company A'),
    shopId: getObjectId('shop Shop A'),
    variant: SUPPLIER_PRICE_VARIANT_DISCOUNT,
    shopProductId: getObjectId(`shop_a 000011`),
    price: 1000,
    percent: 30,
  },
  {
    _id: getObjectId('supplier product B'),
    supplierId: getObjectId('supplier Supplier B'),
    companyId: getObjectId('company Company A'),
    shopId: getObjectId('shop Shop A'),
    variant: SUPPLIER_PRICE_VARIANT_CHARGE,
    shopProductId: getObjectId(`shop_a 000011`),
    price: 1000,
    percent: 30,
  },
];

// @ts-ignore
export = supplierProducts;
