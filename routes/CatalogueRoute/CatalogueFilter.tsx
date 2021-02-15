import * as React from 'react';
import classes from './CatalogueFilter.module.css';
import {
  CatalogueFilterAttributeFragment,
  CatalogueFilterFragment,
} from 'generated/apolloComponents';
import FilterLink from '../../components/Link/FilterLink';
import Link from '../../components/Link/Link';
import { useConfigContext } from 'context/configContext';
import Icon from '../../components/Icon/Icon';
import { useAppContext } from 'context/appContext';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useRouter } from 'next/router';
import { useNotificationsContext } from 'context/notificationsContext';
import Currency from '../../components/Currency/Currency';
import {
  CATALOGUE_FILTER_PRICE_KEYS,
  CATALOGUE_MAX_PRICE_KEY,
  CATALOGUE_MIN_PRICE_KEY,
} from 'config/common';
import { getCatalogueFilterNextPath, getCatalogueFilterValueByKey } from 'lib/catalogueHelpers';
import { noNaN } from 'lib/numbers';
import { useLocaleContext } from 'context/localeContext';

interface CatalogueFilterAttributeInterface {
  attribute: CatalogueFilterAttributeFragment;
}

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributeInterface> = ({ attribute }) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const [isOptionsOpen, setIsOptionsOpen] = React.useState<boolean>(false);
  const maxVisibleOptionsString = getSiteConfigSingleValue('catalogueFilterVisibleOptionsCount');
  const maxVisibleOptions = parseInt(maxVisibleOptionsString, 10);

  const { name, clearSlug, options, isSelected } = attribute;

  const visibleOptions = options.slice(0, maxVisibleOptions);
  const hiddenOptions = options.slice(+maxVisibleOptions);
  const moreTriggerText = isOptionsOpen ? 'Скрыть' : 'Показать еще';
  const moreTriggerIcon = isOptionsOpen ? 'chevron-up' : 'chevron-down';

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
          const testId = `${attribute.slug}-${option.slug}`;
          return (
            <FilterLink
              className={classes.attributeOption}
              option={option}
              key={testId}
              testId={testId}
            />
          );
        })}
        {isOptionsOpen
          ? hiddenOptions.map((option) => {
              const testId = `${attribute.slug}-${option.slug}`;
              return (
                <FilterLink
                  className={classes.attributeOption}
                  option={option}
                  key={testId}
                  testId={testId}
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
  catalogueFilter: CatalogueFilterFragment;
  minPrice: number;
  maxPrice: number;
  totalDocs: number;
  rubricClearSlug: string;
  isFilterVisible: boolean;
  hideFilterHandler: () => void;
}

const CatalogueFilter: React.FC<CatalogueFilterInterface> = ({
  catalogueFilter,
  rubricClearSlug,
  totalDocs,
  hideFilterHandler,
  isFilterVisible,
  minPrice,
  maxPrice,
}) => {
  const router = useRouter();
  const { currency } = useLocaleContext();
  const { showErrorNotification } = useNotificationsContext();
  const { isMobile } = useAppContext();
  const [pricesRanges, setPricesRanges] = React.useState<number[]>(() => [minPrice, maxPrice]);
  const [pricesValue, setPricesValue] = React.useState<number[]>([0, 0]);

  React.useEffect(() => {
    const selectedMinPrice = getCatalogueFilterValueByKey({
      asPath: router.asPath,
      slug: CATALOGUE_MIN_PRICE_KEY,
    });
    const selectedMaxPrice = getCatalogueFilterValueByKey({
      asPath: router.asPath,
      slug: CATALOGUE_MAX_PRICE_KEY,
    });
    if (!selectedMinPrice || !selectedMaxPrice) {
      setPricesValue([minPrice, maxPrice]);
      return;
    }

    setPricesValue([noNaN(selectedMinPrice), noNaN(selectedMaxPrice)]);
  }, [maxPrice, minPrice, router]);

  React.useEffect(() => {
    setPricesRanges([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const resetPricesValueHandler = React.useCallback(() => {
    const nextPath = getCatalogueFilterNextPath({
      asPath: router.asPath,
      excludedKeys: CATALOGUE_FILTER_PRICE_KEYS,
    });
    router.push(nextPath).catch(() => {
      showErrorNotification();
    });
  }, [router, showErrorNotification]);

  const { attributes, selectedPrices } = catalogueFilter;

  const priceRangeHandleStyle = {
    backgroundColor: 'var(--primaryBackground)',
    borderWidth: 1,
    borderColor: 'var(--theme)',
    height: 28,
    width: 28,
    marginTop: -12,
    boxShadow: '0 0 0 rgba(var(--themeRGB), 0.1)',
  };

  return (
    <div className={`${classes.filter} ${isFilterVisible ? classes.filterVisible : ''}`}>
      <div className={classes.filterHolder}>
        <div className={classes.totalCounter}>{`Найдено ${totalDocs}`}</div>

        {isMobile ? (
          <div className={classes.filterTitle}>
            <div className={classes.filterTitleName}>Поиск</div>
            <div className={classes.filterTitleClose} onClick={hideFilterHandler}>
              <Icon name={'cross'} />
            </div>
          </div>
        ) : null}

        {catalogueFilter.selectedAttributes.length > 0 || selectedPrices ? (
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
              {catalogueFilter.selectedAttributes.map((attribute) => {
                return attribute.options.map((option) => {
                  const key = `${attribute.slug}-${option.slug}`;
                  return (
                    <FilterLink
                      withCross
                      className={classes.attributeOption}
                      option={option}
                      key={key}
                      testId={key}
                    />
                  );
                });
              })}
              {selectedPrices ? (
                <div>
                  <FilterLink
                    withCross
                    asLink={false}
                    className={classes.attributeOption}
                    onClick={resetPricesValueHandler}
                    testId={'selected-prices'}
                    option={{
                      _id: selectedPrices.clearSlug,
                      nextSlug: selectedPrices.clearSlug,
                      name: `${selectedPrices.formattedMinPrice}-${selectedPrices.formattedMaxPrice} ${currency}`,
                      isSelected: true,
                      counter: 0,
                      isDisabled: false,
                      slug: 'selected-prices',
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {pricesValue[0] && pricesValue[1] ? (
          <div className={classes.attribute}>
            <div className={classes.attributeTitle}>
              <span className={classes.attributeTitleText}>Цена</span>
            </div>
            <div className={classes.pricesFilterValues}>
              <div className={classes.pricesFilterValuesItem}>
                от
                <Currency value={pricesValue[0]} />
              </div>
              <div className={classes.pricesFilterValuesItem}>
                до
                <Currency value={pricesValue[1]} />
              </div>
            </div>
            <div className={classes.pricesFilterSlider}>
              <Range
                value={pricesValue}
                min={pricesRanges[0]}
                max={pricesRanges[1]}
                onChange={setPricesValue}
                trackStyle={[
                  {
                    backgroundColor: 'var(--theme)',
                  },
                ]}
                railStyle={{
                  height: 2,
                  backgroundColor: 'var(--rangeRailBackground)',
                }}
                handleStyle={[priceRangeHandleStyle, priceRangeHandleStyle]}
                onAfterChange={(val) => {
                  const [minPrice, maxPrice] = val;
                  const options = getCatalogueFilterNextPath({
                    asPath: router.asPath,
                    excludedKeys: CATALOGUE_FILTER_PRICE_KEYS,
                  });
                  const nextPath = `${options}/${CATALOGUE_MIN_PRICE_KEY}-${minPrice}/${CATALOGUE_MAX_PRICE_KEY}-${maxPrice}`;

                  router.push(nextPath).catch(() => {
                    showErrorNotification();
                  });
                }}
              />
            </div>
          </div>
        ) : null}

        {attributes.map((attribute) => {
          return <CatalogueFilterAttribute attribute={attribute} key={attribute._id} />;
        })}
      </div>
    </div>
  );
};

export default CatalogueFilter;
