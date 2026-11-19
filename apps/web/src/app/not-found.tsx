import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main id="main" className="pageMain">
      <div className={`container ${styles.wrap}`}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>This reference is not in the catalog.</h1>
        <p className={styles.body}>
          The page may have been retired with a series. The archive keeps past references; the
          current catalog is under watches.
        </p>
        <div className={styles.links}>
          <Link href="/watches">Watches</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/collections">Collections</Link>
        </div>
      </div>
    </main>
  );
}
