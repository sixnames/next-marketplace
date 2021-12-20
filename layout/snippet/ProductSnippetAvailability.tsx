import * as React from 'react';
import { useConfigContext } from '../../context/configContext';
import { noNaN } from '../../lib/numbers';

interface ProductSnippetAvailabilityInterface {
  shopsCount?: number | null;
  className?: string;
  available: number;
}

const minimalShopsCount = 2;

const ProductSnippetAvailability: React.FC<ProductSnippetAvailabilityInterface> = ({
  shopsCount,
  className,
  available,
}) => {
  const { configs } = useConfigContext();
  const shopsCounterPostfix = noNaN(shopsCount) >= minimalShopsCount ? 'магазинах' : 'магазине';

  if (configs.isOneShopCompany || available < 1) {
    return null;
  }

  return (
    <div className={className}>
      {noNaN(shopsCount) > 0 ? `В наличии в ${shopsCount} ${shopsCounterPostfix}` : 'Нет в наличии'}
    </div>
  );
};

export default ProductSnippetAvailability;
