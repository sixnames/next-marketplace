import FilterCheckbox from 'components/FilterCheckbox';
import Icon from 'components/Icon';
import Link from 'components/Link/Link';
import { CATALOGUE_PRICE_KEY } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import { CatalogueFilterAttributeInterface } from 'db/uiInterfaces';
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
  console.log(selectedAttributes);
  return (
    <div className={className ? className : ''}>
      {attributes.map((attribute) => {
        return <AppContentFilterAttribute attribute={attribute} key={`${attribute._id}`} />;
      })}
    </div>
  );
};

export default AppContentFilter;
