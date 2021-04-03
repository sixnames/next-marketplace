import { UserCompanyFragment, useUserComapnyQuery } from 'generated/apolloComponents';
import * as React from 'react';

interface CompanyContextInterface {
  company?: UserCompanyFragment | null;
  companyLoading: boolean;
}

const CompanyContext = React.createContext<CompanyContextInterface>({
  company: null,
  companyLoading: true,
});

const CompanyContextProvider: React.FC = ({ children }) => {
  const { data, loading } = useUserComapnyQuery();

  const value = React.useMemo(() => {
    return {
      company: data?.getUserCompany,
      companyLoading: loading,
    };
  }, [data, loading]);

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

function useCompanyContext() {
  const context = React.useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within a CompanyContextProvider');
  }

  return context;
}

export { CompanyContextProvider, useCompanyContext };
