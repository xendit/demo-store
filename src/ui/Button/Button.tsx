import type { FC, HTMLProps } from 'react';
import classes from './style.module.css';

type Props = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
};

export const Button: FC<HTMLProps<HTMLButtonElement> & Props> = (props) => {
  const { children, type = 'button', ...rest } = props;

  return (
    <button {...rest} className={classes.button} type={type}>
      {children}
    </button>
  );
};

export const ButtonLoadingSpinner = () => {
  const angle1 = Math.PI * 0.4;
  const angle2 = 0;
  const radius = 0.4;
  const start = { x: Math.cos(angle1) * radius, y: Math.sin(angle1) * radius };
  const end = { x: Math.cos(angle2) * radius, y: Math.sin(angle2) * radius };

  return (
    <svg className={classes.buttonLoadingSpinner} viewBox="-0.5 -0.5 1 1">
      <path
        d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 0 0 ${end.x} ${end.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.1"
        strokeLinecap="round"
      ></path>
    </svg>
  );
};
