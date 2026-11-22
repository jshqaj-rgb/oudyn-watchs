import styles from "./ProductAssurance.module.css";

const ITEMS = [
  {
    title: "Guaranteed authentic watches",
    body: "Every watch we list is authentic. Each one is inspected for authenticity before listing, and any deviation from its original condition is stated in the listing.",
    art: "shield",
    label: "Authenticity guarantee",
  },
  {
    title: "14 days to get your money back",
    body: "If you change your mind, contact us within 14 days of receiving the watch for a full refund of the purchase price. No reason is required; return shipping is arranged in writing.",
    art: "return",
    label: "14-day refund",
  },
  {
    title: "We are here for you",
    body: "A 40-person quality and security team monitors our listings around the clock. If you have a question or concern, write to studio@oudyn.com and we will find a solution.",
    art: "desk",
    label: "40-person team",
  },
] as const;

function Art({ kind }: { kind: (typeof ITEMS)[number]["art"] }) {
  if (kind === "shield") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 5 39 11v12c0 9-6.4 16.4-15 20-8.6-3.6-15-11-15-20V11L24 5Z" />
        <path d="m16.5 23.5 5 5 10-11" />
      </svg>
    );
  }
  if (kind === "return") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 18h17a9 9 0 0 1 0 18H18" />
        <path d="m18 11-7 7 7 7" />
        <path d="M12 42h18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 12h32v22H8z" />
      <path d="m8 13 16 13 16-13" />
      <path d="M16 40h16" />
    </svg>
  );
}

export function ProductAssurance() {
  return (
    <section className={styles.section} aria-labelledby="assurance-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="assurance-title">After-sales commitments</h2>
          <p>What is confirmed before and after payment.</p>
        </div>

        <div className={styles.grid}>
          {ITEMS.map((item, index) => (
            <article className={styles.card} key={item.title}>
              <div className={styles.cardTop}>
                <Art kind={item.art} />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <p className={styles.label}>{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
