import * as React from 'react';
import { SupplierProductInterface } from '../../db/uiInterfaces';
import { getConstantTranslation } from '../../lib/config/constantTranslations';
import { useLocaleContext } from '../context/localeContext';
import Currency from '../Currency';
import Percent from '../Percent';

interface ProductsListSuppliersListInterface {
  supplierProducts: SupplierProductInterface[];
  className?: string;
}

const ProductsListSuppliersList: React.FC<ProductsListSuppliersListInterface> = ({
  supplierProducts,
  className,
}) => {
  const { locale } = useLocaleContext();

  return (
    <div className={`space-y-4 ${className ? className : ''}`}>
      {supplierProducts.map((supplierProduct) => {
        const { supplier, price, percent, variant, recommendedPrice } = supplierProduct;
        if (!supplier) {
          return null;
        }
        const variantName = getConstantTranslation(`suppliers.priceVariant.${variant}.${locale}`);

        return (
          <div key={`${supplierProduct._id}`}>
            <div className='mb-2 flex items-baseline justify-between gap-3'>
              <div className='whitespace-nowrap font-medium'>{supplier.name}</div>
              <div className='whitespace-nowrap text-sm text-secondary-text'>{variantName}</div>
            </div>
            <div className='flex justify-between gap-3'>
              <div className='flex justify-between gap-1'>
                <Currency value={price} />
                <span>/</span>
                <Percent value={percent} />
              </div>
              <div>
                <Currency value={recommendedPrice} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsListSuppliersList;
