import React from 'react';
import { GetRubricQuery, GetRubricQueryVariables } from '../../generated/apolloComponents';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import TabsContent from '../../components/TabsContent/TabsContent';
import RubricDetails from './RubricDetails';
import RubricAttributes from './RubricAttributes';
import RubricProducts from './RubricProducts';
import { QueryResult } from 'react-apollo';
import classes from './RubricsContent.module.css';

interface RubricsContentInterface {
  queryResult: QueryResult<GetRubricQuery, GetRubricQueryVariables>;
}

const RubricsContent: React.FC<RubricsContentInterface> = ({ queryResult = {} }) => {
  const { data, loading, error } = queryResult;

  if (!data && !loading && !error) {
    return <DataLayoutTitle>Выберите рубрику</DataLayoutTitle>;
  }

  if (loading) return <Spinner isNested />;
  if (error || !data || !data.getRubric) return <RequestError />;

  const { getRubric } = data;

  return (
    <DataLayoutContentFrame>
      <TabsContent className={classes.content}>
        <RubricDetails rubric={getRubric} />
        <RubricProducts rubric={getRubric} />
        <RubricAttributes rubric={getRubric} />
      </TabsContent>
    </DataLayoutContentFrame>
  );
};

export default RubricsContent;
