import type { FC, SVGProps } from 'react';

const Cart: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 13C5.27614 13 5.5 13.2239 5.5 13.5C5.5 13.7761 5.27614 14 5 14C4.72386 14 4.5 13.7761 4.5 13.5C4.5 13.2239 4.72386 13 5 13Z"
      fill="currentColor"
      stroke="currentColor"
    />
    <path
      d="M11.5 13C11.7761 13 12 13.2239 12 13.5C12 13.7761 11.7761 14 11.5 14C11.2239 14 11 13.7761 11 13.5C11 13.2239 11.2239 13 11.5 13Z"
      fill="currentColor"
      stroke="currentColor"
    />
    <path
      d="M2.64375 4.5H13.8562L12.2063 10.275C12.1474 10.4846 12.0213 10.669 11.8474 10.8C11.6735 10.931 11.4614 11.0013 11.2437 11H5.25625C5.03855 11.0013 4.82647 10.931 4.65258 10.8C4.47869 10.669 4.35262 10.4846 4.29375 10.275L2.03125 2.3625C2.00135 2.25797 1.9382 2.16604 1.85136 2.10062C1.76452 2.03521 1.65872 1.99989 1.55 2H0.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Cart;
