import { Container } from "../Layout/Layout";
import classes from "./style.module.css";

export const Footer: React.FC = () => {
  return (
    <div className={classes.footer}>
      <Container>
        <div className={classes.footerInner}>
          <p>&copy; 2025 Xendit, Inc.</p>
          <p className={classes.footerLinks}>
            <a href="https://docs.xendit.co/apidocs">API Reference</a> ·{" "}
            <a href="https://docs.xendit.co/docs/overview">Documentation</a>
          </p>
        </div>
      </Container>
    </div>
  );
};
