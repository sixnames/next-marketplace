import * as React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import LanguagesContent from './LanguagesContent';

const LanguagesRoute: React.FC = () => {
  return <DataLayout title={'Языки сайта'} filterResult={() => <LanguagesContent />} />;
};

export default LanguagesRoute;
