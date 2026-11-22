import styles from "./AboutCode.module.css";

const RULES = [
  "Open the case before you believe the story.",
  "The photograph is part of the condition report.",
  "Box and papers are listed, not implied.",
  "A replaced part is disclosed, not hidden.",
  "Polishing is a decision, not a default.",
  "Service the movement before the dial.",
  "Write down what you cannot verify.",
  "A watch is worth what the next owner can prove.",
];

export function AboutCode() {
  return (
    <section className={styles.code} id="quality" aria-labelledby="code-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.kicker}>The OUDYN Code</p>
          <h2 className={styles.title} id="code-title">
            A short manual for buying a second-hand watch.
          </h2>
          <p className={styles.body}>
            These are the rules we buy against. No newsletter, no account, no marketing list — just
            the standard we use to describe a watch.
          </p>
        </div>

        <ol className={styles.rules}>
          {RULES.map((rule, index) => (
            <li key={rule}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{rule}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
