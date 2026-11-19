import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getStories } from "@/lib/api";
import styles from "./stories.module.css";

export const metadata: Metadata = {
  title: "Buyer stories",
  description:
    "Owners talk about the pre-owned watches they bought from OUDYN WATCHS: why they chose them, how they wear them and what happened next.",
};

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <main id="main" className={styles.page}>
      <section className={styles.hero} aria-labelledby="stories-title">
        <Image
          src="/images/rolex/rolex-wrist.jpg"
          alt="A pre-owned gold Rolex worn on the wrist"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span aria-current="page">Buyer stories</span>
          </nav>
          <h1 id="stories-title" className={styles.heroTitle}>
            Bought, worn, lived in.
          </h1>
          <p className={styles.heroText}>
            The watches leave the studio and start a second life. These are the owners who agreed to
            tell us what happened next.
          </p>
          <p className={styles.heroMeta}>
            {String(stories.length).padStart(2, "0")} stories · Verified purchases · Milano
          </p>
        </div>
      </section>

      <section className={styles.list} aria-label="Buyer stories">
        <div className={styles.listInner}>
          {stories.map((story, index) => (
            <article className={styles.card} key={story.slug}>
              <Link href={`/stories/${story.slug}`} className={styles.cardMedia} aria-label={`Read ${story.title}`}>
                <Image
                  src={story.images[0].src}
                  alt={story.images[0].alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className={styles.cardImage}
                />
                <span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span>
              </Link>
              <div className={styles.cardBody}>
                <p className={styles.cardMeta}>
                  {story.customer} · {story.location}
                </p>
                <h2 className={styles.cardTitle}>
                  <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                </h2>
                <p className={styles.cardQuote}>“{story.quote}”</p>
                <div className={styles.cardFoot}>
                  <span>
                    {story.watchName} · {story.purchasedAt}
                  </span>
                  <Link href={`/stories/${story.slug}`} className={styles.readLink}>
                    Read the story →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div>
            <p className={styles.kicker}>Your turn</p>
            <h2>Bought a watch from us? Tell the next owner what it is like to live with.</h2>
          </div>
          <Link href="/contact" className={styles.ctaLink}>
            Share your story →
          </Link>
        </div>
      </section>
    </main>
  );
}
