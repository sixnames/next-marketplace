import ConsoleRubricProductEditor, {
  ConsoleRubricProductEditorInterface,
} from 'components/console/ConsoleRubricProductEditor';
import * as React from 'react';
import Inner from '../Inner';
import WpImage from '../WpImage';

export interface CompanyProductDetailsInterface extends ConsoleRubricProductEditorInterface {}

const CompanyProductDetails: React.FC<CompanyProductDetailsInterface> = ({
  product,
  children,
  seoContentsList,
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
        seoContentsList={seoContentsList}
        companySlug={companySlug}
      />
    </Inner>
  );
};

export default CompanyProductDetails;
