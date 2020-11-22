declare module 'react-json-editor-ajrm';
declare module 'react-json-editor-ajrm/locale/en';

// eslint-disable-next-line no-var
declare var google: any;

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
