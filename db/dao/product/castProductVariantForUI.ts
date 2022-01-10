import { ProductVariantInterface, ProductVariantItemInterface } from '../../uiInterfaces';
import { castAttributeForUI } from '../attributes/castAttributesGroupForUI';
import { castOptionForUI } from '../options/castOptionForUI';

interface CastProductVariantForUI {
  variant: ProductVariantInterface;
  locale: string;
}

export function castProductVariantForUI({
  variant,
  locale,
}: CastProductVariantForUI): ProductVariantInterface | null {
  const variantProducts = (variant.products || []).reduce(
    (acc: ProductVariantItemInterface[], variantProduct) => {
      if (!variantProduct.option) {
        return acc;
      }

      return [
        ...acc,
        {
          ...variantProduct,
          option: castOptionForUI({
            option: variantProduct.option,
            locale,
          }),
        },
      ];
    },
    [],
  );

  if (!variant.attribute) {
    return null;
  }

  return {
    ...variant,
    products: variantProducts,
    attribute: castAttributeForUI({
      attribute: variant.attribute,
      locale,
    }),
  };
}
