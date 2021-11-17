import { noNaN } from 'lib/numbers';
import * as React from 'react';

interface ProductSnippetAvailabilityInterface {
  shopsCount?: number | null;
  className?: string;
}

const minimalShopsCount = 2;

const ProductSnippetAvailability: React.FC<ProductSnippetAvailabilityInterface> = ({
  shopsCount,
  className,
}) => {
  const shopsCounterPostfix = noNaN(shopsCount) >= minimalShopsCount ? 'магазинах' : 'магазине';

  if (noNaN(shopsCount) < minimalShopsCount) {
    return null;
  }

  return (
    <div className={className}>
      {noNaN(shopsCount) > 0 ? `В наличии в ${shopsCount} ${shopsCounterPostfix}` : 'Нет в наличии'}
    </div>
  );
};

export default ProductSnippetAvailability;
