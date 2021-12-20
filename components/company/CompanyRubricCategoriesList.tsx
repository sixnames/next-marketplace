import * as React from 'react';
import { CategoryInterface, CompanyInterface, RubricInterface } from '../../db/uiInterfaces';
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
  rubric,
}) => {
  const renderCategories = React.useCallback(
    (category: CategoryInterface) => {
      const { name, categories, image } = category;

      return (
        <div>
          {image ? (
            <div className='w-[60px] h-[60px] mb-4'>
              <div className='relative pb-[100%] w-full'>
                <WpImage
                  url={image}
                  alt={`${name}`}
                  title={`${name}`}
                  width={80}
                  className='absolute inset-0 w-full h-full object-contain'
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
                  window.open(
                    `${routeBasePath}/rubrics/${rubric._id}/categories/${category._id}`,
                    '_blank',
                  );
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
    [routeBasePath, rubric._id],
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
