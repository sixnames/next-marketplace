import React from 'react';
import { CompanyFragment } from '../../generated/apolloComponents';
// import classes from './CompanyShops.module.css';

interface CompanyShopsInterface {
  company: CompanyFragment;
}

const CompanyShops: React.FC<CompanyShopsInterface> = ({ company }) => {
  return (
    <div>
      <pre>{JSON.stringify(company, null, 2)}</pre>
    </div>
  );
};

export default CompanyShops;
