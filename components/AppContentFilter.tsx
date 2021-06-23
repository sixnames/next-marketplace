import FilterCheckbox from 'components/FilterElements/FilterCheckbox/FilterCheckbox';
import Icon from 'components/Icon';
import Link from 'components/Link/Link';
import { PRICE_ATTRIBUTE_SLUG } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import { CatalogueFilterAttributeInterface } from 'db/uiInterfaces';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

interface AppContentFilterAttributeInterface {
  attribute: CatalogueFilterAttributeInterface;
}

const AppContentFilterAttribute: React.FC<AppContentFilterAttributeInterface> = ({ attribute }) => {
  const { currency } = useLocaleContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const [isOptionsOpen, setIsOptionsOpen] = React.useState<boolean>(false);
  const maxVisibleOptionsString = getSiteConfigSingleValue('catalogueFilterVisibleOptionsCount');
  const maxVisibleOptions = maxVisibleOptionsString ? noNaN(maxVisibleOptionsString) : 5;

  const { name, clearSlug, options, isSelected, metric, slug } = attribute;

  const visibleOptions = options.slice(0, maxVisibleOptions);
  const hiddenOptions = options.slice(+maxVisibleOptions);
  const moreTriggerText = isOptionsOpen ? 'Скрыть' : 'Показать еще';
  const moreTriggerIcon = isOptionsOpen ? 'chevron-up' : 'chevron-down';
  const isPrice = slug === PRICE_ATTRIBUTE_SLUG;
  const postfix = isPrice ? ` ${currency}` : metric ? ` ${metric}` : null;

  return (
    <div className={`mb-8`}>
      <div className={`flex items-baseline`}>
        <span className={`font-medium mb-4 text-lg`}>{name}</span>
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

interface AppContentFilterInterface {
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  clearSlug: string;
  className?: string;
}

const AppContentFilter: React.FC<AppContentFilterInterface> = ({ attributes, className }) => {
  return (
    <div className={className ? className : ''}>
      {attributes.map((attribute) => {
        return <AppContentFilterAttribute attribute={attribute} key={`${attribute._id}`} />;
      })}
    </div>
  );
};

export default AppContentFilter;
