import * as React from 'react';
import { redirectUtil } from '../../../../lib/redirectUtil';

export default function RedirectPage() {
  return <div />;
}
export const getServerSideProps = redirectUtil;
