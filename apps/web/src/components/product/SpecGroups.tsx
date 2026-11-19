import type { SpecGroup } from "@oudyn/contracts";
import styles from "./SpecGroups.module.css";

export function SpecGroups({
  specs,
  className = "",
  compact = false,
  columns = false,
}: {
  specs: SpecGroup[];
  className?: string;
  compact?: boolean;
  columns?: boolean;
}) {
  return (
    <div className={`${styles.groups} ${compact ? styles.compact : ""} ${columns ? styles.columns : ""} ${className ?? ""}`}>
      {specs.map((group) => (
        <section key={group.title} className={styles.group}>
          <h4 className={styles.title}>{group.title}</h4>
          <ul className={styles.list}>
            {group.items.map((item) => (
              <li key={item} className={styles.item}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
