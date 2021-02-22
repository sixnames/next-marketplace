import Spinner from 'components/Spinner/Spinner';
import { alwaysArray } from 'lib/arrayUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import classes from './CatalogueFilter.module.css';
import {
  CatalogueFilterAttributeFragment,
  useCatalogueAdditionsAttributesQuery,
} from 'generated/apolloComponents';
import FilterLink from '../../components/Link/FilterLink';
import Link from '../../components/Link/Link';
import { useConfigContext } from 'context/configContext';
import Icon from '../../components/Icon/Icon';
import { useAppContext } from 'context/appContext';
import 'rc-slider/assets/index.css';

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
          const testId = `${option.slug}`;
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
              const testId = `${option.slug}`;
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
  attributes: CatalogueFilterAttributeFragment[];
  selectedAttributes: CatalogueFilterAttributeFragment[];
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
  const router = useRouter();
  const { isMobile } = useAppContext();
  const [additionalFilters, setAdditionalFilters] = React.useState<
    CatalogueFilterAttributeFragment[] | null
  >(null);
  const { data, loading } = useCatalogueAdditionsAttributesQuery({
    ssr: false,
    variables: {
      input: {
        filter: alwaysArray(router.query.catalogue),
        shownAttributesSlugs: attributes.map(({ slug }) => slug),
      },
    },
  });

  React.useEffect(() => {
    if (data && data.getCatalogueAdditionalAttributes) {
      setAdditionalFilters(data.getCatalogueAdditionalAttributes.additionalAttributes);
    }
  }, [data]);

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
                return attribute.options.map((option) => {
                  const key = `${option.slug}`;
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
            </div>
          </div>
        ) : null}

        {attributes.map((attribute) => {
          return <CatalogueFilterAttribute attribute={attribute} key={attribute._id} />;
        })}

        {loading && !additionalFilters ? <Spinner isNested /> : null}

        {additionalFilters
          ? additionalFilters.map((attribute) => {
              return <CatalogueFilterAttribute attribute={attribute} key={attribute._id} />;
            })
          : null}
      </div>
    </div>
  );
};

export default CatalogueFilter;
