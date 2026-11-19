"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ProductListResponse } from "@oudyn/contracts";
import { clientProducts } from "@/lib/client-api";
import { formatPrice } from "@/lib/api";
import { CloseIcon, SearchIcon } from "@/components/visual/Icons";
import styles from "./SearchOverlay.module.css";

const SUGGESTIONS = ["Diver", "GMT", "Chronograph", "36mm", "Limited", "Strap"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults(null);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.dataset.locked = "true";
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      delete document.body.dataset.locked;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ search: trimmed, limit: "6", sort: "featured" });
        const data = await clientProducts(params);
        if (!cancelled) setResults(data);
      } catch {
        if (!cancelled) setResults(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 220);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, open]);

  if (!open) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onClose();
    router.push(`/watches?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Search OUDYN WATCHS">
      <div className={styles.top}>
        <span className="mono">Search</span>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close search">
          <CloseIcon size={18} />
          <span className="monoSmall">Close</span>
        </button>
      </div>

      <div className={styles.body}>
        <form className={styles.form} onSubmit={submit} role="search">
          <SearchIcon size={20} className={styles.fieldIcon} />
          <label htmlFor="site-search" className="visuallyHidden">
            Search products
          </label>
          <input
            id="site-search"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={styles.input}
            type="search"
            placeholder="Reference, model or material"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className={styles.submit} aria-label="Submit search">
            Enter
          </button>
        </form>

        <div className={styles.suggestions}>
          <span className="monoSmall">Try</span>
          {SUGGESTIONS.map((item) => (
            <button key={item} type="button" className={styles.suggestion} onClick={() => setQuery(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className={styles.results} aria-live="polite">
          {loading && <p className={styles.status}>Searching the catalogue…</p>}
          {!loading && results && results.items.length === 0 && (
            <p className={styles.status}>No pieces match “{query.trim()}”.</p>
          )}
          {!loading &&
            results?.items.map((product) => (
              <Link key={product.id} href={`/watches/${product.slug}`} className={styles.result} onClick={onClose}>
                <span className={styles.thumb}>
                  <Image
                    src={product.images[0] ?? "/images/placeholder-watch.svg"}
                    alt=""
                    fill
                    sizes="64px"
                    className={styles.thumbImage}
                  />
                </span>
                <span className={styles.resultInfo}>
                  <span className={styles.resultName}>{product.name}</span>
                  <span className="monoSmall">{product.specLabel}</span>
                </span>
                <span className={styles.resultPrice}>{formatPrice(product.price)}</span>
              </Link>
            ))}
          {!loading && results && results.items.length > 0 && (
            <Link href={`/watches?q=${encodeURIComponent(query.trim())}`} className={styles.all} onClick={onClose}>
              View all results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
