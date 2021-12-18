import { OrderProductModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const orderProducts: OrderProductModel[] = [
  {
    _id: getObjectId('order a product a'),
    statusId: getObjectId(`orderStatus new`),
    itemId: '000011',
    price: 896,
    amount: 1,
    totalPrice: 896,
    customDiscount: 0,
    finalPrice: 896,
    slug: 'shampanskoe_000011',
    originalName: 'shampanskoe 000011',
    nameI18n: { ru: 'shampanskoe 000011' },
    customerId: getObjectId('admin'),
    productId: getObjectId('shampanskoe 000011'),
    shopProductId: getObjectId(`shopProduct shop_a shampanskoe_000011 000011`),
    shopId: getObjectId('shop Shop A'),
    companyId: getObjectId('company Company A'),
    orderId: getObjectId('order a'),
    barcode: ['000011'],
    allowDelivery: false,
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
    customDiscount: 0,
    finalPrice: 593,
    slug: 'viski_000081',
    originalName: 'viski 000081',
    nameI18n: { ru: 'viski 000081' },
    customerId: getObjectId('admin'),
    productId: getObjectId('viski 000011'),
    shopProductId: getObjectId(`shopProduct shop_a viski_000081 000081`),
    shopId: getObjectId('shop Shop A'),
    companyId: getObjectId('company Company A'),
    orderId: getObjectId('order a'),
    barcode: ['000081'],
    allowDelivery: false,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

// @ts-ignore
export = orderProducts;
