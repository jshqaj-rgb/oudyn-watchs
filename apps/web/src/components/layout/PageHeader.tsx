import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

type Props = {
  title: string;
  intro?: string;
  meta?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({ title, intro, meta, children }: Props) {
  return (
    <header className={styles.head}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.body}>
        {intro && <p className={styles.intro}>{intro}</p>}
        {children}
        {meta && <div className={styles.meta}>{meta}</div>}
      </div>
    </header>
  );
}
