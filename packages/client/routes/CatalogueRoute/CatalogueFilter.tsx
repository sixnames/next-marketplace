import React from 'react';
import classes from './CatalogueFilter.module.css';
import {
  CatalogueRubricFilterAttributeFragment,
  CatalogueRubricFilterFragment,
} from '../../generated/apolloComponents';
import FilterLink from '../../components/Link/FilterLink';
import Link from '../../components/Link/Link';

interface CatalogueFilterAttributeInterface {
  attribute: CatalogueRubricFilterAttributeFragment;
}

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributeInterface> = ({ attribute }) => {
  const {
    node: { slug, nameString },
    clearSlug,
    options,
    isSelected,
  } = attribute;

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
        {options.map((option) => {
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
      </div>
    </div>
  );
};

interface CatalogueFilterInterface {
  catalogueFilter: CatalogueRubricFilterFragment;
  totalDocs: number;
  rubricSlug: string;
}

const CatalogueFilter: React.FC<CatalogueFilterInterface> = ({
  catalogueFilter,
  rubricSlug,
  totalDocs,
}) => {
  return (
    <div className={classes.filter}>
      <div className={classes.filterHolder}>
        <div className={classes.totalCounter}>{`Найдено ${totalDocs}`}</div>

        {catalogueFilter.selectedAttributes.length > 0 ? (
          <div className={classes.attribute}>
            <div className={classes.attributeTitle}>
              <span className={classes.attributeTitleText}>Выбранные</span>
              <Link href={`/${rubricSlug}`} className={classes.attributeTitleTrigger}>
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

        {catalogueFilter.attributes.map((attribute) => {
          return <CatalogueFilterAttribute attribute={attribute} key={attribute.id} />;
        })}
      </div>
    </div>
  );
};

export default CatalogueFilter;
