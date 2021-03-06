import ControlButton from 'components/button/ControlButton';
import { useSiteUserContext } from 'components/context/siteUserContext';
import { ProductFacetInterface } from 'db/uiInterfaces';

import * as React from 'react';

interface ProductSnippetEditButtonInterface {
  product: ProductFacetInterface;
}

const ProductSnippetEditButton: React.FC<ProductSnippetEditButtonInterface> = ({ product }) => {
  const sessionUser = useSiteUserContext();
  if (!sessionUser || !sessionUser.showAdminUiInCatalogue) {
    return null;
  }
  return (
    <div className='absolute top-0 left-0 z-50'>
      <ControlButton
        size={'small'}
        iconSize={'small'}
        icon={'pencil'}
        theme={'accent'}
        ariaLabel={'edit'}
        roundedTopLeft
        onClick={() => {
          window.open(
            `${sessionUser.editLinkBasePath}/rubrics/${product.rubricSlug}/products/product/${product._id}`,
            '_blank',
          );
        }}
      />
    </div>
  );
};

export default ProductSnippetEditButton;
