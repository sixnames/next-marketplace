import FilterCheckbox from 'components/FilterCheckbox';
import Icon from 'components/Icon';
import FilterLink from 'components/Link/FilterLink';
import Link from 'components/Link/Link';
import { CATALOGUE_PRICE_KEY } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import {
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
} from 'db/uiInterfaces';
import * as React from 'react';

interface AppContentFilterAttributeInterface {
  attribute: CatalogueFilterAttributeInterface;
}

const AppContentFilterAttribute: React.FC<AppContentFilterAttributeInterface> = ({ attribute }) => {
  const { currency } = useLocaleContext();
  const { configs } = useConfigContext();
  const [isOptionsOpen, setIsOptionsOpen] = React.useState<boolean>(false);
  const maxVisibleOptions = configs.catalogueFilterVisibleOptionsCount;

  const { name, clearSlug, options, isSelected, metric, slug } = attribute;

  const visibleOptions = options.slice(0, maxVisibleOptions);
  const hiddenOptions = options.slice(+maxVisibleOptions);
  const moreTriggerText = isOptionsOpen ? 'Скрыть' : 'Показать еще';
  const moreTriggerIcon = isOptionsOpen ? 'chevron-up' : 'chevron-down';
  const isPrice = slug === CATALOGUE_PRICE_KEY;
  const postfix = isPrice ? ` ${currency}` : metric ? ` ${metric}` : null;

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
        {visibleOptions.map((option) => {
          const testId = `${option.slug}`;
          return <FilterCheckbox option={option} testId={testId} key={testId} postfix={postfix} />;
        })}
        {isOptionsOpen
          ? hiddenOptions.map((option) => {
              const testId = `${option.slug}`;
              return (
                <FilterCheckbox option={option} testId={testId} key={testId} postfix={postfix} />
              );
            })
          : null}
      </div>

      {hiddenOptions.length > 0 ? (
        <div
          className={`flex items-center cursor-pointer mt-4`}
          onClick={() => setIsOptionsOpen((prevState) => !prevState)}
        >
          <Icon className={'w-4 h-4 mr-4'} name={moreTriggerIcon} />
          {moreTriggerText}
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
  clearSlug: string;
  className?: string;
}

const AppContentFilter: React.FC<AppContentFilterInterface> = ({
  attributes,
  selectedAttributes,
  className,
}) => {
  const { currency } = useLocaleContext();

  return (
    <div>
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
          return <AppContentFilterAttribute attribute={attribute} key={`${attribute._id}`} />;
        })}
      </div>
    </div>
  );
};

export default AppContentFilter;
