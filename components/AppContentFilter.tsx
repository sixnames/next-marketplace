import Accordion from 'components/Accordion';
import FilterCheckbox from 'components/FilterCheckbox';
import FilterLink from 'components/Link/FilterLink';
import Link from 'components/Link/Link';
import { BrandOptionsModalInterface } from 'components/Modal/BrandOptionsModal';
import { CatalogueAdditionalOptionsModalInterface } from 'components/Modal/CatalogueAdditionalOptionsModal';
import { CategoryOptionsModalInterface } from 'components/Modal/CategoryOptionsModal';
import { OptionsModalOptionInterface } from 'components/Modal/OptionsModal';
import {
  CATALOGUE_BRAND_KEY,
  CATALOGUE_CATEGORY_KEY,
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  CATALOGUE_PRICE_KEY,
  FILTER_SEPARATOR,
} from 'config/common';
import {
  BRAND_OPTIONS_MODAL,
  CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
  CATEGORY_OPTIONS_MODAL,
} from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import {
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
} from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { useRouter } from 'next/router';
import * as React from 'react';

interface AppContentFilterAttributeInterface {
  attribute: CatalogueFilterAttributeInterface;
  basePath: string;
  rubricSlug: string;
  excludedParams: string[];
  brandSlugs: string[];
  categorySlugs: string[];
}

const AppContentFilterAttribute: React.FC<AppContentFilterAttributeInterface> = ({
  attribute,
  rubricSlug,
  basePath,
  excludedParams,
  brandSlugs,
  categorySlugs,
}) => {
  const router = useRouter();
  const { query } = router;
  const { showModal, hideModal } = useAppContext();
  const { currency } = useLocaleContext();
  const { configs } = useConfigContext();
  const maxVisibleOptions =
    configs.catalogueFilterVisibleOptionsCount || CATALOGUE_FILTER_VISIBLE_OPTIONS;

  const { name, clearSlug, options, isSelected, metric, slug, totalOptionsCount } = attribute;

  const isCategory = slug === CATALOGUE_CATEGORY_KEY;
  const isBrand = slug === CATALOGUE_BRAND_KEY;
  const isPrice = slug === CATALOGUE_PRICE_KEY;
  const hasMoreOptions =
    (totalOptionsCount > maxVisibleOptions || isBrand || isCategory) && !isPrice;
  const postfix = isPrice ? ` ${currency}` : metric ? ` ${metric}` : null;

  const navigateFromModal = React.useCallback(
    (selectedOptions: OptionsModalOptionInterface[]) => {
      hideModal();
      const selectedOptionsSlugs = selectedOptions.map(({ slug }) => {
        return `${attribute.slug}${FILTER_SEPARATOR}${slug}`;
      });
      const nextParamsList = [...alwaysArray(query.filters), ...selectedOptionsSlugs].filter(
        (param) => {
          if (!excludedParams) {
            return param;
          }
          return !excludedParams.includes(param);
        },
      );
      const nextParams = nextParamsList.join('/');
      router.push(`${basePath}/${nextParams}`).catch((e) => {
        console.log(e);
      });
    },
    [attribute.slug, basePath, hideModal, query.filters, router],
  );

  const showMoreHandler = () => {
    // simple attribute options modal
    if (hasMoreOptions) {
      showModal<CatalogueAdditionalOptionsModalInterface>({
        variant: CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
        props: {
          basePath,
          rubricSlug,
          attributeSlug: attribute.slug,
          notShowAsAlphabet: attribute.notShowAsAlphabet,
          title: attribute.name,
          excludedParams,
        },
      });
    }

    // brand attribute options modal
    if (isBrand) {
      showModal<BrandOptionsModalInterface>({
        variant: BRAND_OPTIONS_MODAL,
        props: {
          onSubmit: navigateFromModal,
          slugs: brandSlugs,
        },
      });
    }

    // brand attribute options modal
    if (isCategory) {
      showModal<CategoryOptionsModalInterface>({
        variant: CATEGORY_OPTIONS_MODAL,
        props: {
          onSubmit: navigateFromModal,
          slugs: categorySlugs,
        },
      });
    }
  };

  return (
    <div className={`mb-8`}>
      <div className={`flex mb-1 items-baseline`}>
        <span className={`font-medium text-lg`}>{name}</span>
        {isSelected ? (
          <Link href={clearSlug} className={`ml-4`}>
            Очистить
          </Link>
        ) : null}
      </div>

      <div className={``}>
        {options.map((option) => {
          const testId = `${option.slug}`;
          return <FilterCheckbox option={option} testId={testId} key={testId} postfix={postfix} />;
        })}
      </div>

      {hasMoreOptions ? (
        <div className='uppercase cursor-pointer hover:text-theme mt-6' onClick={showMoreHandler}>
          Показать еще
        </div>
      ) : null}
    </div>
  );
};

function getSelectedOptions(
  option: CatalogueFilterAttributeOptionInterface,
  acc: CatalogueFilterAttributeOptionInterface[],
): CatalogueFilterAttributeOptionInterface[] {
  const newAcc = [...acc];
  if (option.isSelected) {
    newAcc.push(option);
  }
  if (!option.options || option.options.length < 1) {
    return newAcc;
  }

  const nestedOptions = option.options.reduce(
    (nestedAcc: CatalogueFilterAttributeOptionInterface[], nestedOption) => {
      const nestedOptions = getSelectedOptions(nestedOption, nestedAcc);
      return [...nestedAcc, ...nestedOptions];
    },
    [],
  );
  nestedOptions.forEach((option) => {
    newAcc.push(option);
  });
  return newAcc;
}

interface AppContentFilterInterface {
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  excludedParams: string[];
  clearSlug: string;
  basePath: string;
  rubricSlug: string;
  className?: string;
  brandSlugs: string[];
  categorySlugs: string[];
}

const AppContentFilter: React.FC<AppContentFilterInterface> = ({
  attributes,
  selectedAttributes,
  className,
  clearSlug,
  basePath,
  rubricSlug,
  excludedParams,
  brandSlugs,
  categorySlugs,
}) => {
  const { currency } = useLocaleContext();

  return (
    <Accordion
      title={'Фильтр'}
      titleRight={
        selectedAttributes.length > 0 ? <Link href={clearSlug}>Очистить фильтр</Link> : null
      }
    >
      <div className='mt-8'>
        {selectedAttributes.length > 0 ? (
          <div className='mb-8'>
            <div className='mb-3 font-medium text-lg text-secondary-text'>Выбранные фильтры</div>

            {selectedAttributes.map((attribute, attributeIndex) => {
              const { name, clearSlug, options, isSelected, metric, slug } = attribute;
              const isPrice = slug === CATALOGUE_PRICE_KEY;
              const postfix = isPrice ? ` ${currency}` : metric ? ` ${metric}` : null;
              const selectedOptions = options.reduce(
                (acc: CatalogueFilterAttributeOptionInterface[], option) => {
                  return [...acc, ...getSelectedOptions(option, [])];
                },
                [],
              );

              return (
                <div className='mb-4' key={slug}>
                  <div className={`flex mb-2 items-baseline`}>
                    <span className={`font-medium text-lg`}>{name}</span>
                    {isSelected ? (
                      <Link href={clearSlug} className={`ml-4`}>
                        Очистить
                      </Link>
                    ) : null}
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {selectedOptions.map((option, optionIndex) => {
                      const testId = `catalogue-option-${attributeIndex}-${optionIndex}`;
                      return (
                        <FilterLink
                          withCross
                          option={option}
                          key={option.slug}
                          testId={testId}
                          postfix={postfix}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        <div className={className ? className : ''}>
          {attributes.map((attribute) => {
            return (
              <AppContentFilterAttribute
                brandSlugs={brandSlugs}
                categorySlugs={categorySlugs}
                excludedParams={excludedParams}
                basePath={basePath}
                rubricSlug={rubricSlug}
                attribute={attribute}
                key={`${attribute._id}`}
              />
            );
          })}
        </div>
      </div>
    </Accordion>
  );
};

export default AppContentFilter;
