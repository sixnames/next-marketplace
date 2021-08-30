import * as React from 'react';

const BlogListPage: React.FC = () => {
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

export default BlogListPage;
