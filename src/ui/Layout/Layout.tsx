import type { FC, ReactNode } from 'react';
import classes from './style.module.css';

export const Page: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={classes.page}>{children}</div>;
};

export const Container: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={classes.container}>{children}</div>;
};

export const Columns: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={classes.columns}>{children}</div>;
};

export const Column: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={classes.column}>{children}</div>;
};

export const WideColumn: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={classes.wide}>{children}</div>;
};
