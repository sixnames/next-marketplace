import * as React from 'react';
import ControlButton from '../../components/button/ControlButton';
import { useSiteUserContext } from '../../context/siteUserContext';
import { ProductInterface } from '../../db/uiInterfaces';

interface ProductSnippetEditButtonInterface {
  product: ProductInterface;
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
            `${sessionUser.editLinkBasePath}/rubrics/${product.rubricId}/products/product/${product._id}`,
            '_blank',
          );
        }}
      />
    </div>
  );
};

export default ProductSnippetEditButton;
