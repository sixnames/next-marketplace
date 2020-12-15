import React from 'react';
import classes from './CatalogueFilter.module.css';
import { CatalogueRubricFilterAttributeFragment } from '../../generated/apolloComponents';
import FilterLink from '../../components/Link/FilterLink';
import Link from '../../components/Link/Link';
import { useRouter } from 'next/router';
import { alwaysArray } from '@yagu/shared';

interface CatalogueFilterAttributeInterface {
  attribute: CatalogueRubricFilterAttributeFragment;
}

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributeInterface> = ({ attribute }) => {
  const { query = {} } = useRouter();
  const {
    node: { slug, nameString },
    options,
  } = attribute;
  const allSelectedOptions = alwaysArray(query.catalogue);
  const otherAttributesSelectedValues = allSelectedOptions.filter((option) => {
    return !option.includes(slug);
  });
  const clearUrl = `/${otherAttributesSelectedValues.join('/')}`;

  return (
    <div className={classes.attribute}>
      <div className={classes.attributeTitle}>
        <span className={classes.attributeTitleText}>{nameString}</span>
        <Link href={clearUrl} className={classes.attributeTitleTrigger}>
          Очистить
        </Link>
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
  filterAttributes: CatalogueRubricFilterAttributeFragment[];
  totalDocs: number;
  rubricSlug: string;
}

const CatalogueFilter: React.FC<CatalogueFilterInterface> = ({
  filterAttributes,
  rubricSlug,
  totalDocs,
}) => {
  return (
    <div className={classes.filter}>
      <div className={classes.filterHolder}>
        <div className={classes.totalCounter}>{`Найдено ${totalDocs}`}</div>

        <div className={classes.attribute}>
          <div className={classes.attributeTitle}>
            <span className={classes.attributeTitleText}>Выбранные</span>
            <Link href={`/${rubricSlug}`} className={classes.attributeTitleTrigger}>
              Очистить все
            </Link>
          </div>

          <div className={classes.attributeList}>list of selected options</div>
        </div>

        {filterAttributes.map((attribute) => {
          return <CatalogueFilterAttribute attribute={attribute} key={attribute.id} />;
        })}
      </div>
    </div>
  );
};

export default CatalogueFilter;
