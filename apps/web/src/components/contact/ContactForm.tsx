"use client";

import { useState } from "react";
import { clientContact } from "@/lib/client-api";
import styles from "./ContactForm.module.css";

type Props = {
  defaultSubject?: string;
  subjectOptions?: string[];
};

const SUBJECTS = [
  "Buy a watch",
  "Sell or trade a watch",
  "Service or authentication",
  "Order support",
  "Press or partnership",
  "Something else",
];

export function ContactForm({ defaultSubject = "Buy a watch", subjectOptions }: Props) {
  const options = subjectOptions ?? SUBJECTS;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    try {
      const result = await clientContact({ name, email, subject, reference, message });
      setState("done");
      setFeedback(`Message received. Reference ${result.messageId}. We will reply when we have checked the request.`);
      setName("");
      setEmail("");
      setReference("");
      setMessage("");
    } catch (error) {
      setState("error");
      setFeedback(error instanceof Error ? error.message : "The message could not be sent.");
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Name</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            placeholder="Your name"
          />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Subject</span>
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Reference number (optional)</span>
          <input
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="e.g. ODN-01-STA"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Message</span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us what you are looking for, or which watch you would like to sell."
        />
      </label>

      <div className={styles.footer}>
        <button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Sending…" : "Send message"}
        </button>
        <p className={styles.privacy}>
          By sending this form you agree to our{" "}
          <a href="/privacy">privacy policy</a>. We never share your details.
        </p>
      </div>

      {feedback && (
        <p className={styles.status} data-error={state === "error" || undefined} role="status">
          {feedback}
        </p>
      )}
    </form>
  );
}
