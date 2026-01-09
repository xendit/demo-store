import { Container } from '../Layout/Layout';
import classes from './style.module.css';

export const Footer: React.FC = () => {
  return (
    <div className={classes.footer}>
      <Container>
        <div className={classes.footerInner}>
          <p>&copy; 2025 Xendit, Inc.</p>
          <p className={classes.footerLinks}>
            <a href="#">API Reference</a> · <a href="#">Documentation</a>
          </p>
        </div>
      </Container>
    </div>
  );
};
