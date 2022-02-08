import * as React from 'react';
import ConsoleRubricProductEditor, {
  ConsoleRubricProductEditorInterface,
} from 'components/console/ConsoleRubricProductEditor';
import Inner from '../Inner';
import WpImage from '../WpImage';

export interface CompanyProductDetailsInterface extends ConsoleRubricProductEditorInterface {
  routeBasePath: string;
}

const CompanyProductDetails: React.FC<CompanyProductDetailsInterface> = ({
  product,
  children,
  cardContent,
  companySlug,
}) => {
  const { originalName, mainImage } = product;

  return (
    <Inner testId={'product-details'}>
      <div className='relative mb-8 h-[15rem] w-[15rem]'>
        <WpImage
          url={mainImage}
          alt={originalName}
          title={originalName}
          width={120}
          className='absolute inset-0 h-full w-full object-contain'
        />
      </div>

      {children}

      <ConsoleRubricProductEditor
        product={product}
        cardContent={cardContent}
        companySlug={companySlug}
      />
    </Inner>
  );
};

export default CompanyProductDetails;
