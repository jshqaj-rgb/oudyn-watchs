"use client";

import Image from "next/image";
import Link from "next/link";
import { useRomeClock } from "@/components/time/useRomeClock";
import styles from "./AboutHero.module.css";

export function AboutHero() {
  const { mounted, clock, weather, moon } = useRomeClock();

  return (
    <section className={styles.hero} aria-labelledby="about-title">
      <Image
        src="/images/rolex/rolex-dark.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span aria-current="page">About us</span>
        </nav>
        <h1 className={styles.title} id="about-title">
          Pre-owned watches, chosen the slow way.
        </h1>
        <div className={styles.meta}>
          <span>
            {mounted && clock ? clock.time : "--:--:--"}
            <br />
            Hong Kong
            <br />
            {mounted && weather ? `${weather.temperature}° ${weather.label}` : "Local weather"}
          </span>
          <span>
            Moon
            <br />
            {mounted ? moon : "—"}
          </span>
          <span>
            Based in
            <br />
            Independent dealer
          </span>
        </div>
      </div>
    </section>
  );
}
