"use client";

import { useState } from "react";
import { clientNewsletter } from "@/lib/client-api";
import { ArrowRightIcon } from "@/components/visual/Icons";
import styles from "./Hero.module.css";

export function NewsletterPanel({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      await clientNewsletter(email);
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={`${styles.panel} ${className}`}>
      <p className={styles.panelLabel}>Newsletter</p>
      <h2 className={styles.panelTitle}>Dispatches from the workshop</h2>
      {status === "done" ? (
        <p className={styles.panelSuccess} role="status">
          You are on the list. Next dispatch when a reference is released.
        </p>
      ) : (
        <>
          <p className={styles.panelText}>
            New references, restocks and archive notes. One letter a month, no more.
          </p>
          <form className={styles.form} onSubmit={onSubmit}>
            <label className={styles.field}>
              <span className="visuallyHidden">Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="EMAIL ADDRESS"
                autoComplete="email"
                aria-label="Email address"
              />
            </label>
            <button type="submit" className={styles.submit} disabled={status === "loading"} aria-label="Subscribe">
              {status === "loading" ? "..." : <ArrowRightIcon size={16} />}
            </button>
          </form>
          <p className={styles.panelError} role="status">
            {status === "error" ? "That address did not go through. Try again." : ""}
          </p>
        </>
      )}
      <a href="/collections" className={styles.panelLink}>
        Capsule 04 — view the release
      </a>
    </div>
  );
}
