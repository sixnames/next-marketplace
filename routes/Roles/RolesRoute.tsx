import DataLayout from 'components/DataLayout/DataLayout';
import * as React from 'react';
import RolesContent from 'routes/Roles/RolesContent';

const RolesRoute: React.FC = () => {
  return (
    <DataLayout
      title={'Роли'}
      filterResult={() => {
        return <RolesContent />;
      }}
    />
  );
};

export default RolesRoute;
