import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import ProfileContent from './ProfileContent';

const ProfileRoute: React.FC = () => {
  return <DataLayout title={'Настройки профиля'} filterResult={() => <ProfileContent />} />;
};

export default ProfileRoute;
