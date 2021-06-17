import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import { CATALOGUE_OPTION_SEPARATOR, PAGE_DEFAULT, QUERY_FILTER_PAGE } from 'config/common';
import { useRouter } from 'next/router';
import * as React from 'react';

interface FormikRouterSearchInterface {
  testId: string;
}

const FormikRouterSearch: React.FC<FormikRouterSearchInterface> = ({ testId }) => {
  const router = useRouter();

  const initialValue = React.useMemo(() => {
    const { search } = router.query;
    if (search && search.length > 0) {
      return `${search}`;
    }
    return '';
  }, [router.query]);

  const basePath = React.useMemo(() => {
    const cleanAsPath = router.asPath.split('?')[0];
    const cleanAsPathArray = cleanAsPath.split('/').filter((param) => {
      return param && param.length > 0;
    });

    const basePath = cleanAsPathArray.reduce((acc: string, param) => {
      const paramArray = param.split(CATALOGUE_OPTION_SEPARATOR);
      if (paramArray[0] === QUERY_FILTER_PAGE) {
        return `${acc}/${QUERY_FILTER_PAGE}${CATALOGUE_OPTION_SEPARATOR}${PAGE_DEFAULT}`;
      }
      return `${acc}/${param}`;
    }, '');

    return basePath;
  }, [router.asPath]);

  return (
    <FormikIndividualSearch
      initialValue={initialValue}
      testId={testId}
      onReset={() => {
        router.push(basePath).catch((e) => console.log(e));
      }}
      onSubmit={(search) => {
        if (search && search.length > 0) {
          router.push(`${basePath}?search=${search}`).catch(console.log);
        } else {
          router.push(basePath).catch(console.log);
        }
      }}
    />
  );
};

export default FormikRouterSearch;
