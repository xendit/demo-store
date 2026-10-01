import { Container } from "../Layout/Layout";
import classes from "./style.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={classes.footer}>
      <Container>
        <div className={classes.footerInner}>
          <p>&copy; 2026 Demo Store</p>
          <p className={classes.footerLinks}>
            <a target="_blank" rel="noopener noreferrer" href="#">
              API Reference
            </a>
            <a target="_blank" rel="noopener noreferrer" href="#">
              Documentation
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
};
