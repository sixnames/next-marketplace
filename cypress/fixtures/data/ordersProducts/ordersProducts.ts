import { OrderProductModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const orderProducts: OrderProductModel[] = [
  {
    _id: getObjectId('order a product a'),
    statusId: getObjectId(`orderStatus new`),
    itemId: '000011',
    price: 896,
    amount: 1,
    totalPrice: 896,
    slug: 'shampanskoe_000011',
    originalName: 'shampanskoe 000011',
    nameI18n: { ru: 'shampanskoe 000011' },
    customerId: getObjectId('admin'),
    productId: getObjectId('e63c53ab5ffb0c3f1b225f6c'),
    shopProductId: getObjectId('143070795e9854135e3c4c95'),
    shopId: getObjectId('shop Shop A'),
    companyId: getObjectId('company Company A'),
    orderId: getObjectId('order a'),
    barcode: '000011',
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('order a product b'),
    statusId: getObjectId(`orderStatus new`),
    itemId: '000081',
    price: 593,
    amount: 1,
    totalPrice: 593,
    slug: 'viski_000081',
    originalName: 'viski 000081',
    nameI18n: { ru: 'viski 000081' },
    customerId: getObjectId('admin'),
    productId: getObjectId('b977fadafdb3044026f6bf72'),
    shopProductId: getObjectId('8eadfafd99ea2aa02162005f'),
    shopId: getObjectId('shop Shop A'),
    companyId: getObjectId('company Company A'),
    orderId: getObjectId('order a'),
    barcode: '000081',
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

// @ts-ignore
export = orderProducts;
