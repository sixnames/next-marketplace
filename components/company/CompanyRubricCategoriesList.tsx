import * as React from 'react';
import { CategoryInterface, CompanyInterface, RubricInterface } from '../../db/uiInterfaces';
import { getCmsCompanyLinks } from '../../lib/linkUtils';
import ContentItemControls from '../button/ContentItemControls';
import Inner from '../Inner';
import RequestError from '../RequestError';
import WpImage from '../WpImage';

export interface CompanyRubricCategoriesListInterface {
  rubric: RubricInterface;
  pageCompany: CompanyInterface;
  routeBasePath: string;
}

const CompanyRubricCategoriesList: React.FC<CompanyRubricCategoriesListInterface> = ({
  routeBasePath,
  pageCompany,
  rubric,
}) => {
  const renderCategories = React.useCallback(
    (category: CategoryInterface) => {
      const { name, categories, image } = category;

      return (
        <div>
          {image ? (
            <div className='mb-4 h-[60px] w-[60px]'>
              <div className='relative w-full pb-[100%]'>
                <WpImage
                  url={image}
                  alt={`${name}`}
                  title={`${name}`}
                  width={80}
                  className='absolute inset-0 h-full w-full object-contain'
                />
              </div>
            </div>
          ) : null}
          <div className='cms-option flex items-center gap-4'>
            {category.icon ? (
              <div
                className='categories-icon-preview'
                dangerouslySetInnerHTML={{ __html: category.icon.icon }}
              />
            ) : null}
            <div className='font-medium' data-cy={`category-${name}`}>
              {name}
            </div>
            <div className='cms-option__controls'>
              <ContentItemControls
                testId={`${name}`}
                justifyContent={'flex-end'}
                updateTitle={'Редактировать категорию'}
                updateHandler={() => {
                  const links = getCmsCompanyLinks({
                    companyId: pageCompany._id,
                    rubricSlug: rubric.slug,
                    categoryId: category._id,
                    basePath: routeBasePath,
                  });
                  window.open(links.rubrics.category.root, '_blank');
                }}
              />
            </div>
          </div>
          {categories && categories.length > 0 ? (
            <div className='ml-4'>
              {categories.map((category) => (
                <div className='mt-4' key={`${category._id}`}>
                  {renderCategories(category)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    },
    [pageCompany._id, routeBasePath, rubric.slug],
  );
  const { categories } = rubric;

  return (
    <Inner testId={'rubric-categories-list'}>
      <div className='relative'>
        {!categories || categories.length < 1 ? (
          <RequestError message={'Список пуст'} />
        ) : (
          <div className='border-t border-border-300'>
            {categories.map((category) => (
              <div
                className='border-b border-border-300 py-6 px-inner-block-horizontal-padding'
                key={`${category._id}`}
              >
                {renderCategories(category)}
              </div>
            ))}
          </div>
        )}
      </div>
    </Inner>
  );
};

export default CompanyRubricCategoriesList;
