import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import RubricsFilter from './RubricsFilter';
import RubricsContent from './RubricsContent';
import { NavItemInterface } from '../../types';
import { useGetRubricQuery } from '../../generated/apolloComponents';
import { RUBRIC_LEVEL_THREE, RUBRIC_LEVEL_ZERO } from '@rg/config';
import NoRubricProducts from './NoRubricProducts';
import { QUERY_DATA_LAYOUT_NO_RUBRIC } from '../../config';
import useRouterQuery from '../../hooks/useRouterQuery';
import qs from 'querystring';

const RubricsRoute: React.FC = () => {
  const { pathname, query } = useRouterQuery();
  const { rubric } = query;
  const queryResult = useGetRubricQuery({
    fetchPolicy: 'network-only',
    skip: !rubric || rubric === QUERY_DATA_LAYOUT_NO_RUBRIC,
    variables: {
      id: `${rubric}`,
    },
  });

  const { data } = queryResult;
  const level = data && data.getRubric ? data.getRubric.level : RUBRIC_LEVEL_ZERO;

  function generateTabSearch(tab: number) {
    return `?${qs.stringify({ ...query, tab })}`;
  }

  const filterResultNavConfig: NavItemInterface[] = [
    {
      name: 'Детали',
      to: {
        pathname,
        search: generateTabSearch(0),
      },
      testId: 'details',
    },
    {
      name: 'Товары',
      hidden: level !== RUBRIC_LEVEL_THREE,
      to: {
        pathname,
        search: generateTabSearch(1),
      },
      testId: 'products',
    },
    {
      name: 'Атрибуты',
      to: {
        pathname,
        search: generateTabSearch(2),
      },
      testId: 'attributes',
    },
  ];

  return (
    <DataLayout
      title={'Рубрикатор'}
      filterContent={<RubricsFilter />}
      filterResultNavConfig={rubric ? filterResultNavConfig : null}
      filterResult={() => {
        if (rubric === QUERY_DATA_LAYOUT_NO_RUBRIC) {
          return <NoRubricProducts />;
        }

        return <RubricsContent queryResult={queryResult} />;
      }}
    />
  );
};

export default RubricsRoute;
