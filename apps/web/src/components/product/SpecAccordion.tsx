"use client";

import { useId, useState } from "react";
import type { SpecGroup } from "@oudyn/contracts";
import { ChevronDownIcon } from "@/components/visual/Icons";
import styles from "./SpecAccordion.module.css";

export function SpecAccordion({
  specs,
  className = "",
  defaultOpen = 0,
}: {
  specs: SpecGroup[];
  className?: string;
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();

  return (
    <div className={`${styles.root} ${className}`}>
      {specs.map((group, index) => {
        const expanded = open === index;
        return (
          <section key={group.title} className={styles.group}>
            <h3 className={styles.heading}>
              <button
                type="button"
                className={styles.trigger}
                onClick={() => setOpen(expanded ? -1 : index)}
                aria-expanded={expanded}
                aria-controls={`${baseId}-spec-${index}`}
              >
                <span>{group.title}</span>
                <span className={styles.icon} data-open={expanded || undefined}>
                  <ChevronDownIcon size={14} />
                </span>
              </button>
            </h3>
            <div id={`${baseId}-spec-${index}`} className={styles.panel} hidden={!expanded}>
              <ul className={styles.list}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
