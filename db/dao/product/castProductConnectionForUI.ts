import { ProductConnectionInterface, ProductConnectionItemInterface } from '../../uiInterfaces';
import { castAttributeForUI } from '../attributes/castAttributesGroupForUI';
import { castOptionForUI } from '../options/castOptionForUI';

interface CastProductConnectionForUI {
  connection: ProductConnectionInterface;
  locale: string;
}

export function castProductConnectionForUI({
  connection,
  locale,
}: CastProductConnectionForUI): ProductConnectionInterface | null {
  const connectionProducts = (connection.connectionProducts || []).reduce(
    (acc: ProductConnectionItemInterface[], connectionProduct) => {
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
