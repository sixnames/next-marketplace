import React, { useEffect, useState } from 'react';
import classes from './CatalogueFilter.module.css';
import {
  CatalogueRubricFilterAttributeFragment,
  CatalogueRubricFilterFragment,
} from '../../generated/apolloComponents';
import FilterLink from '../../components/Link/FilterLink';
import Link from '../../components/Link/Link';
import { useConfigContext } from '../../context/configContext';
import Icon from '../../components/Icon/Icon';
import Button from '../../components/Buttons/Button';
import { useAppContext } from '../../context/appContext';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useRouter } from 'next/router';
import { useNotificationsContext } from '../../context/notificationsContext';
import Currency from '../../components/Currency/Currency';

interface CatalogueFilterAttributeInterface {
  attribute: CatalogueRubricFilterAttributeFragment;
}

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributeInterface> = ({ attribute }) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const maxVisibleOptionsString = getSiteConfigSingleValue('catalogueFilterVisibleOptionsCount');
  const maxVisibleOptions = parseInt(maxVisibleOptionsString, 10);

  const {
    node: { slug, nameString },
    clearSlug,
    options,
    isSelected,
  } = attribute;

  const visibleOptions = options.slice(0, maxVisibleOptions);
  const hiddenOptions = options.slice(+maxVisibleOptions);
  const moreTriggerText = isOptionsOpen ? 'Скрыть' : 'Показать еще';
  const moreTriggerIcon = isOptionsOpen ? 'chevron-up' : 'chevron-down';

  return (
    <div className={classes.attribute}>
      <div className={classes.attributeTitle}>
        <span className={classes.attributeTitleText}>{nameString}</span>
        {isSelected ? (
          <Link href={clearSlug} className={classes.attributeTitleTrigger}>
            Очистить
          </Link>
        ) : null}
      </div>

      <div className={classes.attributeList}>
        {visibleOptions.map((option) => {
          const key = `${slug}-${option.slug}`;
          return (
            <FilterLink
              className={classes.attributeOption}
              key={key}
              option={option}
              attributeSlug={slug}
              testId={key}
            />
          );
        })}
        {isOptionsOpen
          ? hiddenOptions.map((option) => {
              const key = `${slug}-${option.slug}`;
              return (
                <FilterLink
                  className={classes.attributeOption}
                  key={key}
                  option={option}
                  attributeSlug={slug}
                  testId={key}
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
  catalogueFilter: CatalogueRubricFilterFragment;
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
  const { showErrorNotification } = useNotificationsContext();
  const { isMobile } = useAppContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const [pricesValue, setPricesValue] = useState<number[]>(() => [minPrice, maxPrice]);
  const [isAttributesOpen, setIsAttributesOpen] = useState<boolean>(false);

  useEffect(() => {
    setPricesValue([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const maxVisibleAttributesString = getSiteConfigSingleValue(
    'catalogueFilterVisibleAttributesCount',
  );
  const maxVisibleAttributes = parseInt(maxVisibleAttributesString, 10);
  const { attributes } = catalogueFilter;
  const visibleAttributes = attributes.slice(0, maxVisibleAttributes);
  const hiddenAttributes = attributes.slice(+maxVisibleAttributes);

  const moreTriggerText = isAttributesOpen
    ? 'Скрыть дополнительные фильтры'
    : 'Показать больше фильтров';

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

        {catalogueFilter.selectedAttributes.length > 0 ? (
          <div className={classes.attribute}>
            <div className={classes.attributeTitle}>
              <span className={classes.attributeTitleText}>Выбранные</span>
              <Link href={rubricClearSlug} className={classes.attributeTitleTrigger}>
                Очистить все
              </Link>
            </div>

            <div className={classes.attributeList}>
              {catalogueFilter.selectedAttributes.map((attribute) => {
                return attribute.options.map((option) => {
                  const key = `${attribute.node.slug}-${option.slug}`;
                  return (
                    <FilterLink
                      withCross
                      className={classes.attributeOption}
                      key={key}
                      option={option}
                      attributeSlug={attribute.node.slug}
                      testId={key}
                    />
                  );
                });
              })}
            </div>
          </div>
        ) : null}

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
              min={minPrice}
              max={maxPrice}
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
                router
                  .push({
                    href: router.asPath,
                    query: {
                      ...router.query,
                      minPrice: val[0],
                      maxPrice: val[1],
                    },
                  })
                  .catch(() => {
                    showErrorNotification();
                  });
              }}
            />
          </div>
        </div>

        {visibleAttributes.map((attribute) => {
          return <CatalogueFilterAttribute attribute={attribute} key={attribute.id} />;
        })}

        {isAttributesOpen
          ? hiddenAttributes.map((attribute) => {
              return <CatalogueFilterAttribute attribute={attribute} key={attribute.id} />;
            })
          : null}

        {hiddenAttributes.length > 0 ? (
          <Button
            className={classes.moreAttributesTrigger}
            onClick={() => setIsAttributesOpen((prevState) => !prevState)}
            theme={'secondary'}
          >
            {moreTriggerText}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default CatalogueFilter;
