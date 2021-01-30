import * as React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import ConfigsContent from './ConfigsContent';

const ConfigsRoute: React.FC = () => {
  return <DataLayout title={'Настройки сайта'} filterResult={() => <ConfigsContent />} />;
};

export default ConfigsRoute;
