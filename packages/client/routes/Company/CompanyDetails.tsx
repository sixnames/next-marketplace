import React from 'react';
import { CompanyFragment } from '../../generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
// import classes from './CompanyDetails.module.css';

interface CompanyDetailsInterface {
  company: CompanyFragment;
}

const CompanyDetails: React.FC<CompanyDetailsInterface> = ({ company }) => {
  return (
    <Inner testId={'company-details'}>
      <pre>{JSON.stringify(company, null, 2)}</pre>
    </Inner>
  );
};

export default CompanyDetails;
