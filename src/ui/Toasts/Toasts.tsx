import type { FC } from 'react';
import classes from './style.module.css';

export const Toasts: FC<{
  toasts: string[];
}> = (props) => {
  const { toasts } = props;

  return (
    <div className={classes.toastsContainer}>
      {toasts.map((toast, index) => (
        <div key={index} className={classes.toast}>
          {toast}
        </div>
      ))}
    </div>
  );
};
