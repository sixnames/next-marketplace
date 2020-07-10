import React from 'react';
import {
  Attribute,
  AttributesGroup,
  Maybe,
  Option,
  OptionsGroup,
  RubricAttributesGroup,
} from '../../generated/apolloComponents';
import { ATTRIBUTE_TYPE_MULTIPLE_SELECT, ATTRIBUTE_TYPE_SELECT } from '../../config';
import FilterCheckboxGroup from '../../components/FilterElements/FilterCheckbox/FilterCheckboxGroup';
import classes from './CatalogueFilter.module.css';

type RubricAttributesGroupType = Pick<RubricAttributesGroup, 'id' | 'showInCatalogueFilter'> & {
  node: Pick<AttributesGroup, 'id' | 'nameString'> & {
    attributes: Array<
      Pick<Attribute, 'id' | 'nameString' | 'variant' | 'slug'> & {
        options?: Maybe<
          Pick<OptionsGroup, 'id' | 'nameString'> & {
            options: Array<Pick<Option, 'id' | 'nameString' | 'color' | 'slug'>>;
          }
        >;
      }
    >;
  };
};

type AttributeType = RubricAttributesGroupType['node']['attributes'][0];

interface CatalogueFilterInterface {
  attributesGroups: Array<RubricAttributesGroupType>;
  rubricSlug: string;
}

interface CatalogueFilterItemInterface {
  group: RubricAttributesGroupType;
  rubricSlug: string;
}

interface CatalogueFilterAttributeInterface {
  attribute: AttributeType;
  rubricSlug: string;
}

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributeInterface> = ({ attribute }) => {
  const { nameString, variant, options, slug } = attribute;

  if (
    options &&
    (variant === ATTRIBUTE_TYPE_MULTIPLE_SELECT || variant === ATTRIBUTE_TYPE_SELECT)
  ) {
    return (
      <div className={classes.attribute}>
        <FilterCheckboxGroup
          checkboxItems={options.options}
          queryKey={`${slug}`}
          label={nameString}
        />
      </div>
    );
  }

  return null;
};

const CatalogueFilterGroup: React.FC<CatalogueFilterItemInterface> = ({ group, rubricSlug }) => {
  const { node, showInCatalogueFilter } = group;
  const { attributes } = node;

  return (
    <div className={classes.group}>
      <div>
        {attributes.map((attribute) => {
          if (!showInCatalogueFilter.includes(attribute.id)) {
            return null;
          }

          return (
            <CatalogueFilterAttribute
              attribute={attribute}
              key={attribute.id}
              rubricSlug={rubricSlug}
            />
          );
        })}
      </div>
    </div>
  );
};

const CatalogueFilter: React.FC<CatalogueFilterInterface> = ({ attributesGroups, rubricSlug }) => {
  return (
    <div className={classes.filter}>
      {attributesGroups.map((group) => {
        return <CatalogueFilterGroup group={group} key={group.id} rubricSlug={rubricSlug} />;
      })}
    </div>
  );
};

export default CatalogueFilter;
