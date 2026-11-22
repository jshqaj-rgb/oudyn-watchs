"use client";

import { useState } from "react";
import type { Product } from "@oudyn/contracts";
import { ArrowRightIcon } from "@/components/visual/Icons";
import styles from "./ProductAdvisors.module.css";

type Advisor = {
  id: string;
  desk: string;
  role: string;
  languages: string;
  initials: string;
};

const ADVISORS: Advisor[] = [
  {
    id: "hong-kong",
    desk: "Hong Kong desk",
    role: "Availability & viewings",
    languages: "English · Cantonese · Mandarin",
    initials: "HK",
  },
  {
    id: "guangzhou",
    desk: "Guangzhou desk",
    role: "Sourcing & trade-ins",
    languages: "Mandarin · Cantonese · English",
    initials: "GZ",
  },
  {
    id: "authentication",
    desk: "Authentication desk",
    role: "Condition & documentation",
    languages: "English · Mandarin",
    initials: "AU",
  },
  {
    id: "shipping",
    desk: "Shipping desk",
    role: "Delivery, insurance & customs",
    languages: "English · Cantonese",
    initials: "SH",
  },
  {
    id: "after-sales",
    desk: "After-sales desk",
    role: "Servicing & follow-up",
    languages: "English · Mandarin",
    initials: "AS",
  },
];

export function ProductAdvisors({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const advisor = ADVISORS[active];
  const subject = encodeURIComponent(
    `Advisor enquiry — ${product.name}${product.ref ? ` (ref. ${product.ref})` : ""}`,
  );

  return (
    <section className={styles.advisors} aria-labelledby="advisors-title">
      <div className={styles.head}>
        <h2 id="advisors-title">Your after-sales advisor</h2>
        <span>
          {String(active + 1).padStart(2, "0")} / {String(ADVISORS.length).padStart(2, "0")}
        </span>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Choose an advisory desk">
        {ADVISORS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={item.desk}
            className={styles.tab}
            data-active={index === active ? "" : undefined}
            onClick={() => setActive(index)}
          >
            {item.initials}
          </button>
        ))}
      </div>

      <div className={styles.selected} role="tabpanel">
        <span className={styles.avatar} aria-hidden="true">
          {advisor.initials}
        </span>
        <div className={styles.copy}>
          <strong>{advisor.desk}</strong>
          <span>{advisor.role}</span>
          <small>{advisor.languages}</small>
        </div>
      </div>

      <p className={styles.intro}>
        Ask about this reference before you pay — condition, set contents, delivery or
        after-sales. No personal phone numbers are published; write to the desk and we reply
        from the same inbox.
      </p>

      <a
        className={styles.contact}
        href={`mailto:studio@oudyn.com?subject=${subject}&body=${encodeURIComponent(
          `Please route this to the ${advisor.desk}.`,
        )}`}
      >
        Contact this desk
        <ArrowRightIcon size={13} />
      </a>
    </section>
  );
}
