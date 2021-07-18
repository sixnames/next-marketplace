import * as React from 'react';

const Index: React.FC = () => {
  return <div />;
};

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: true,
      destination: `/`,
    },
  };
};

export default Index;
