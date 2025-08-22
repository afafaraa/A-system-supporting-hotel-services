declare module '*.svg?react' {
  import * as React from 'react';
  const SVGComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default SVGComponent;
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}