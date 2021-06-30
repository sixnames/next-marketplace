import { CatalogueAdditionalOptionsModalInterface } from 'components/Modal/CatalogueAdditionalOptionsModal';
import {
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  PRICE_ATTRIBUTE_SLUG,
  ROUTE_CATALOGUE,
} from 'config/common';
import { CATALOGUE_ADDITIONAL_OPTIONS_MODAL } from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import { CatalogueFilterAttributeInterface } from 'db/uiInterfaces';
import { noNaN } from 'lib/numbers';
import * as React from 'react';
import classes from './CatalogueFilter.module.css';
import FilterLink from '../../components/Link/FilterLink';
import Link from '../../components/Link/Link';
import { useConfigContext } from 'context/configContext';
import Icon from 'components/Icon';
import { useAppContext } from 'context/appContext';
import 'rc-slider/assets/index.css';

interface CatalogueFilterAttributePropsInterface {
  attribute: CatalogueFilterAttributeInterface;
  companyId?: string;
  rubricSlug: string;
  onClick: () => void;
}

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributePropsInterface> = ({
  attribute,
  companyId,
  rubricSlug,
  onClick,
}) => {
  const { showModal } = useAppContext();
  const { currency } = useLocaleContext();
  const { getSiteConfigSingleValue } = useConfigContext();
  const maxVisibleOptionsString = getSiteConfigSingleValue('catalogueFilterVisibleOptionsCount');
  const maxVisibleOptions = maxVisibleOptionsString
    ? noNaN(maxVisibleOptionsString)
    : noNaN(CATALOGUE_FILTER_VISIBLE_OPTIONS);

  const { name, clearSlug, options, isSelected, metric, slug } = attribute;
  const isPrice = slug === PRICE_ATTRIBUTE_SLUG;
  const postfix = isPrice ? ` ${currency}` : metric ? ` ${metric}` : null;

  return (
    <div className={classes.attribute}>
      <div className={classes.attributeTitle}>
        <span className={classes.attributeTitleText}>{name}</span>
        {isSelected ? (
          <Link href={clearSlug} onClick={onClick} className={classes.attributeTitleTrigger}>
            Очистить
          </Link>
        ) : null}
      </div>

      <div className={classes.attributeList}>
        {options.map((option) => {
          const testId = `catalogue-option-${option.slug}`;
          return (
            <FilterLink
              onClick={onClick}
              className={classes.attributeOption}
              option={option}
              key={testId}
              testId={testId}
              postfix={postfix}
            />
          );
        })}
      </div>

      {options.length === maxVisibleOptions && !isPrice ? (
        <div
          className={`${classes.moreTrigger}`}
          onClick={() => {
            showModal<CatalogueAdditionalOptionsModalInterface>({
              variant: CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
              props: {
                rubricSlug,
                attributeSlug: attribute.slug,
                notShowAsAlphabet: attribute.notShowAsAlphabet,
                title: attribute.name,
                companyId,
              },
            });
          }}
        >
          Показать еще
        </div>
      ) : null}
    </div>
  );
};

interface CatalogueFilterInterface {
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  catalogueCounterString: string;
  rubricSlug: string;
  isFilterVisible: boolean;
  hideFilterHandler: () => void;
  companyId?: string;
}

const CatalogueFilter: React.FC<CatalogueFilterInterface> = ({
  attributes,
  selectedAttributes,
  rubricSlug,
  catalogueCounterString,
  hideFilterHandler,
  isFilterVisible,
  companyId,
}) => {
  const { currency } = useLocaleContext();
  const { isMobile } = useAppContext();

  return (
    <div
      className={`catalogue__filter lg:col-span-2 lg:flex lg:items-end inset-0 fixed z-[140] lg:z-10 bg-primary lg:relative overflow-auto h-[calc(var(--fullHeight,100vh)-var(--mobileNavHeight))] lg:h-auto ${
        isFilterVisible ? 'block lg:flex' : 'hidden lg:flex'
      }`}
    >
      <div className={`pb-12 lg:pb-0 w-full ${classes.filterHolder}`}>
        <div className={classes.totalCounter}>{catalogueCounterString}</div>

        {isMobile ? (
          <div className={classes.filterTitle}>
            <div className={classes.filterTitleName}>Фильтр</div>
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
                href={`${ROUTE_CATALOGUE}/${rubricSlug}`}
                className={classes.attributeTitleTrigger}
                onClick={hideFilterHandler}
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
                      onClick={hideFilterHandler}
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
          return (
            <CatalogueFilterAttribute
              onClick={hideFilterHandler}
              rubricSlug={rubricSlug}
              companyId={companyId}
              attribute={attribute}
              key={`${attribute._id}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CatalogueFilter;
