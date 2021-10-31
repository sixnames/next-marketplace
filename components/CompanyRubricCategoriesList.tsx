import ContentItemControls from 'components/ContentItemControls';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import WpImage from 'components/WpImage';
import { CategoryInterface, CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface CompanyRubricCategoriesListInterface {
  rubric: RubricInterface;
  currentCompany?: CompanyInterface | null;
  routeBasePath: string;
}

const CompanyRubricCategoriesList: React.FC<CompanyRubricCategoriesListInterface> = ({
  routeBasePath,
  rubric,
}) => {
  const router = useRouter();
  const renderCategories = React.useCallback(
    (category: CategoryInterface) => {
      const { name, categories, image } = category;

      return (
        <div>
          {image ? (
            <div>
              <div className='relative pb-[100%] w-[80px]'>
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
                  router
                    .push(`${routeBasePath}/rubrics/${rubric._id}/categories/${category._id}`)
                    .catch(console.log);
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
    [routeBasePath, router, rubric._id],
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
