import { ProductVariantInterface, ProductVariantItemInterface } from '../../uiInterfaces';
import { castAttributeForUI } from '../attributes/castAttributesGroupForUI';
import { castOptionForUI } from '../options/castOptionForUI';

interface CastProductConnectionForUI {
  connection: ProductVariantInterface;
  locale: string;
}

export function castProductConnectionForUI({
  connection,
  locale,
}: CastProductConnectionForUI): ProductVariantInterface | null {
  const connectionProducts = (connection.connectionProducts || []).reduce(
    (acc: ProductVariantItemInterface[], connectionProduct) => {
      if (!connectionProduct.option) {
        return acc;
      }

      return [
        ...acc,
        {
          ...connectionProduct,
          option: castOptionForUI({
            option: connectionProduct.option,
            locale,
          }),
        },
      ];
    },
    [],
  );

  if (!connection.attribute) {
    return null;
  }

  return {
    ...connection,
    connectionProducts,
    attribute: castAttributeForUI({
      attribute: connection.attribute,
      locale,
    }),
  };
}
