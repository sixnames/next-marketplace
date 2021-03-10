import Accordion from 'components/Accordion/Accordion';
import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import RubricMainFields from 'components/FormTemplates/RubricMainFields';
import InnerWide from 'components/Inner/InnerWide';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import { ROUTE_CMS } from 'config/common';
import { Form, Formik } from 'formik';
import {
  UpdateRubricInput,
  useGetAllRubricVariantsQuery,
  useGetRubricBySlugQuery,
  useUpdateRubricMutation,
} from 'generated/apolloComponents';
import { ALL_RUBRICS_QUERY } from 'graphql/complex/rubricsQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useSessionCity from 'hooks/useSessionCity';
import useValidationSchema from 'hooks/useValidationSchema';
import AppLayout from 'layout/AppLayout/AppLayout';
import { useRouter } from 'next/router';
import * as React from 'react';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import classes from 'routes/Rubrics/RubricDetails.module.css';
import { NavItemInterface } from 'types/clientTypes';
import { updateRubricSchema } from 'validation/rubricSchema';

const RubricDetails: React.FC = () => {
  const { query } = useRouter();
  const city = useSessionCity();
  const rubricQuery = useGetRubricBySlugQuery({
    variables: {
      slug: `${query.rubricSlug}`,
    },
  });
  const validationSchema = useValidationSchema({
    schema: updateRubricSchema,
  });
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({});
  const [updateRubricMutation] = useUpdateRubricMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: ALL_RUBRICS_QUERY,
      },
    ],
    onCompleted: (data) => onCompleteCallback(data.updateRubric),
    onError: onErrorCallback,
  });

  const { data, loading, error } = useGetAllRubricVariantsQuery();

  const filterResultNavConfig: NavItemInterface[] = React.useMemo(() => {
    const rubric = rubricQuery.data?.getRubricBySlug;

    if (!rubric) {
      return [];
    }

    const basePath = `/${city}${ROUTE_CMS}/rubrics/${rubric.slug}`;

    return [
      {
        name: 'Детали',
        path: basePath,
        testId: 'details',
      },
      {
        name: 'Товары',
        path: `${basePath}/products/1`,
        testId: 'products',
      },
      {
        name: 'Атрибуты',
        path: `${basePath}/attributes`,
        testId: 'attributes',
      },
    ];
  }, [city, rubricQuery]);

  if (loading || rubricQuery.loading) {
    return <Spinner />;
  }

  if (
    error ||
    !data ||
    !data.getAllRubricVariants ||
    rubricQuery.error ||
    !rubricQuery.data?.getRubricBySlug
  ) {
    return <RequestError />;
  }

  const {
    _id = '',
    name,
    active,
    variantId,
    descriptionI18n,
    shortDescriptionI18n,
    nameI18n,
    catalogueTitle,
  } = rubricQuery.data.getRubricBySlug;

  const initialValues: UpdateRubricInput = {
    rubricId: _id,
    active,
    nameI18n,
    descriptionI18n,
    shortDescriptionI18n,
    catalogueTitle: {
      defaultTitleI18n: catalogueTitle.defaultTitleI18n,
      prefixI18n: catalogueTitle.prefixI18n,
      keywordI18n: catalogueTitle.keywordI18n,
      gender: catalogueTitle.gender,
    },
    variantId,
  };

  return (
    <DataLayout
      title={name}
      filterResultNavConfig={filterResultNavConfig}
      filterResult={() => {
        return (
          <div data-cy={'rubric-details'}>
            <DataLayoutContentFrame>
              <InnerWide>
                <Formik
                  validationSchema={validationSchema}
                  initialValues={initialValues}
                  enableReinitialize
                  onSubmit={(values) => {
                    showLoading();
                    return updateRubricMutation({
                      variables: {
                        input: values,
                      },
                    });
                  }}
                >
                  {() => {
                    return (
                      <Form>
                        <div className={classes.section}>
                          <Accordion title={'Основная информация'} isOpen>
                            <div className={classes.content}>
                              <RubricMainFields />
                            </div>
                          </Accordion>
                        </div>

                        <FixedButtons>
                          <Button size={'small'} type={'submit'} testId={'rubric-submit'}>
                            Сохранить
                          </Button>
                        </FixedButtons>
                      </Form>
                    );
                  }}
                </Formik>
              </InnerWide>
            </DataLayoutContentFrame>
          </div>
        );
      }}
    />
  );
};

const Rubric: NextPage = () => {
  return (
    <AppLayout>
      <RubricDetails />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Rubric;
