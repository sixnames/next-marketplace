import * as React from 'react';
import ControlButton from '../../components/button/ControlButton';
import { useSiteUserContext } from '../../context/siteUserContext';
import { ProductFacetInterface } from '../../db/uiInterfaces';
import { getConsoleRubricLinks } from '../../lib/linkUtils';

interface ProductSnippetEditButtonInterface {
  product: ProductFacetInterface;
}

const ProductSnippetEditButton: React.FC<ProductSnippetEditButtonInterface> = ({ product }) => {
  const sessionUser = useSiteUserContext();
  if (!sessionUser || !sessionUser.showAdminUiInCatalogue) {
    return null;
  }
  const links = getConsoleRubricLinks({
    rubricSlug: product.rubricSlug,
    productId: product._id,
    basePath: sessionUser.editLinkBasePath,
  });
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
          window.open(links.product.root, '_blank');
        }}
      />
    </div>
  );
};

export default ProductSnippetEditButton;
