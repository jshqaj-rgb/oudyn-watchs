"use client";

import { useState } from "react";
import { clientNewsletter } from "@/lib/client-api";
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
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      await clientNewsletter(email.trim());
      setState("done");
      setMessage("You are on the list.");
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Subscription failed.");
    }
  };

  return (
    <section className={styles.code} id="quality" aria-labelledby="code-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.kicker}>The OUDYN Code</p>
          <h2 className={styles.title} id="code-title">
            A short manual for buying a second-hand watch.
          </h2>
          <p className={styles.body}>
            We publish the rules we buy against, so a watch can be judged against evidence rather
            than a story. Notes from the studio, one letter a month.
          </p>
          <form className={styles.form} onSubmit={submit}>
            <label className={styles.field}>
              <span>Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <button type="submit" disabled={state === "loading"}>
              {state === "loading" ? "Joining…" : "Join the list"}
            </button>
          </form>
          {message && <p className={styles.status}>{message}</p>}
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
