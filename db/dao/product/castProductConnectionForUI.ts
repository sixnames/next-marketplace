import { castAttributeForUI } from 'db/dao/attributes/castAttributesGroupForUI';
import { castOptionForUI } from 'db/dao/options/castOptionForUI';
import { ProductConnectionInterface, ProductConnectionItemInterface } from 'db/uiInterfaces';

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
