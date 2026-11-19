"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store/StoreProvider";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import styles from "./Header.module.css";

const NAV = [
  { href: "/watches?sort=newest", label: "New in" },
  { href: "/watches", label: "Watches" },
  { href: "/sell", label: "Sell" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "Our world" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const rawPathname = usePathname();
  const pathname = rawPathname !== "/" ? rawPathname.replace(/\/+$/, "") : "/";
  const { cartCount, wishlistCount, openCart } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);

  const darkHero =
    pathname === "/" ||
    pathname === "/watches" ||
    pathname === "/about" ||
    pathname === "/stories" ||
    pathname.startsWith("/stories/") ||
    pathname === "/sell";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const threshold = darkHero ? (pathname === "/" ? window.innerHeight - 120 : 400) : 80;
      setAtTop(window.scrollY < threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [darkHero, pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.dataset.locked;
    document.body.dataset.locked = "true";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (previous) document.body.dataset.locked = previous;
      else delete document.body.dataset.locked;
    };
  }, [menuOpen]);

  const lightLogo = darkHero && atTop && !menuOpen;

  return (
    <header className={styles.header} data-light-logo={lightLogo || undefined}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="OUDYN home">
          OUDYN
        </Link>

        <nav className={styles.navPill} aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actionsPill}>
          <button
            type="button"
            className={styles.action}
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            Search
          </button>
          <Link href="/account" className={styles.action}>
            Account
          </Link>
          <Link href="/wishlist" className={styles.action}>
            Wishlist
            {wishlistCount > 0 && <span className={styles.count}>{wishlistCount}</span>}
          </Link>
          <button
            type="button"
            className={styles.action}
            onClick={openCart}
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          >
            Cart
            {cartCount > 0 && <span className={styles.dot} aria-hidden="true" />}
          </button>
        </div>

        <div className={styles.mobileActions}>
          <button
            type="button"
            className={styles.mobilePill}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <button
            type="button"
            className={styles.mobilePill}
            onClick={openCart}
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          >
            Cart
            {cartCount > 0 && <span className={styles.dot} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu} id="mobile-menu">
          <nav className={styles.mobileNav} aria-label="Mobile">
            {NAV.map((item, index) => (
              <Link key={item.label} href={item.href} className={styles.mobileLink}>
                <span className={styles.mobileIndex}>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.mobileSub}>
            <button type="button" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>
              Search
            </button>
            <Link href="/account">Account</Link>
            <Link href="/wishlist">Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}</Link>
            <Link href="/archive">Archive</Link>
          </div>
          <p className={styles.mobileNote}>OUDYN · Milano · 45.4642° N</p>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
