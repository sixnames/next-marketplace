import { PRICE_ATTRIBUTE_SLUG } from 'config/common';
import { useLocaleContext } from 'context/localeContext';
import { CatalogueFilterAttributeInterface } from 'db/uiInterfaces';
import { noNaN } from 'lib/numbers';
import * as React from 'react';
import classes from './CatalogueFilter.module.css';
import FilterLink from '../../components/Link/FilterLink';
import Link from '../../components/Link/Link';
import { useConfigContext } from 'context/configContext';
import Icon from '../../components/Icon/Icon';
import { useAppContext } from 'context/appContext';
import 'rc-slider/assets/index.css';

interface CatalogueFilterAttributePropsInterface {
  attribute: CatalogueFilterAttributeInterface;
}

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributePropsInterface> = ({
  attribute,
}) => {
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
    <div className={classes.attribute}>
      <div className={classes.attributeTitle}>
        <span className={classes.attributeTitleText}>{name}</span>
        {isSelected ? (
          <Link href={clearSlug} className={classes.attributeTitleTrigger}>
            Очистить
          </Link>
        ) : null}
      </div>

      <div className={classes.attributeList}>
        {visibleOptions.map((option) => {
          const testId = `${option.slug}`;
          return (
            <FilterLink
              className={classes.attributeOption}
              option={option}
              key={testId}
              testId={testId}
              postfix={postfix}
            />
          );
        })}
        {isOptionsOpen
          ? hiddenOptions.map((option) => {
              const testId = `${option.slug}`;
              return (
                <FilterLink
                  className={classes.attributeOption}
                  option={option}
                  key={testId}
                  testId={testId}
                  postfix={postfix}
                />
              );
            })
          : null}
      </div>

      {hiddenOptions.length > 0 ? (
        <div
          className={`${classes.moreTrigger} ${isOptionsOpen ? classes.moreTriggerActive : ''}`}
          onClick={() => setIsOptionsOpen((prevState) => !prevState)}
        >
          <Icon name={moreTriggerIcon} />
          {moreTriggerText}
        </div>
      ) : null}
    </div>
  );
};

interface CatalogueFilterInterface {
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  catalogueCounterString: string;
  rubricClearSlug: string;
  isFilterVisible: boolean;
  hideFilterHandler: () => void;
}

const CatalogueFilter: React.FC<CatalogueFilterInterface> = ({
  attributes,
  selectedAttributes,
  rubricClearSlug,
  catalogueCounterString,
  hideFilterHandler,
  isFilterVisible,
}) => {
  const { currency } = useLocaleContext();
  const { isMobile } = useAppContext();

  return (
    <div className={`${classes.filter} ${isFilterVisible ? classes.filterVisible : ''}`}>
      <div className={classes.filterHolder}>
        <div className={classes.totalCounter}>{catalogueCounterString}</div>

        {isMobile ? (
          <div className={classes.filterTitle}>
            <div className={classes.filterTitleName}>Поиск</div>
            <div className={classes.filterTitleClose} onClick={hideFilterHandler}>
              <Icon name={'cross'} />
            </div>
          </div>
        ) : null}

        {selectedAttributes.length > 0 ? (
          <div className={classes.attribute}>
            <div className={classes.attributeTitle}>
              <span className={classes.attributeTitleText}>Выбранные</span>
              <Link
                href={rubricClearSlug}
                className={classes.attributeTitleTrigger}
                onClick={() => {
                  if (isMobile) {
                    hideFilterHandler();
                  }
                }}
              >
                Очистить все
              </Link>
            </div>

            <div className={classes.attributeList}>
              {selectedAttributes.map((attribute) => {
                const { metric, slug } = attribute;
                const isPrice = slug === PRICE_ATTRIBUTE_SLUG;
                const postfix = isPrice ? ` ${currency}` : metric ? ` ${metric}` : null;
                return attribute.options.map((option) => {
                  const key = `${option.slug}`;
                  return (
                    <FilterLink
                      withCross
                      className={classes.attributeOption}
                      option={option}
                      key={key}
                      testId={key}
                      postfix={postfix}
                    />
                  );
                });
              })}
            </div>
          </div>
        ) : null}

        {attributes.map((attribute) => {
          return <CatalogueFilterAttribute attribute={attribute} key={`${attribute._id}`} />;
        })}
      </div>
    </div>
  );
};

export default CatalogueFilter;
