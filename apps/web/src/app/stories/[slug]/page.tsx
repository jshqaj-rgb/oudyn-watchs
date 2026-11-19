import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProduct, getStories, getStory } from "@/lib/api";
import styles from "./story.module.css";

type Params = { slug: string };

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((story) => ({ slug: story.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const story = await getStory(slug);
    return {
      title: story.title,
      description: story.excerpt,
    };
  } catch {
    return { title: "Buyer story" };
  }
}

export default async function StoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  let story;
  try {
    story = await getStory(slug);
  } catch {
    notFound();
  }

  const [stories, watch] = await Promise.all([
    getStories(),
    getProduct(story.watchSlug).catch(() => null),
  ]);
  const next = stories[(stories.findIndex((item) => item.slug === story.slug) + 1) % stories.length];

  return (
    <main id="main" className={styles.page}>
      <section className={styles.hero} aria-labelledby="story-title">
        <Image
          src={story.images[0].src}
          alt={story.images[0].alt}
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
            <Link href="/stories">Stories</Link>
            <span>/</span>
            <span aria-current="page">{story.customer}</span>
          </nav>
          <p className={styles.heroMeta}>
            {story.customer} · {story.location} · {story.purchasedAt}
          </p>
          <h1 id="story-title" className={styles.heroTitle}>
            {story.title}
          </h1>
        </div>
      </section>

      <section className={styles.article}>
        <div className={styles.articleInner}>
          <aside className={styles.aside}>
            <div className={styles.fact}>
              <span>Owner</span>
              <p>{story.customer}</p>
            </div>
            <div className={styles.fact}>
              <span>Location</span>
              <p>{story.location}</p>
            </div>
            <div className={styles.fact}>
              <span>Watch</span>
              <p>{story.watchName}</p>
            </div>
            <div className={styles.fact}>
              <span>Acquired</span>
              <p>{story.purchasedAt}</p>
            </div>
            {story.verified && <p className={styles.verified}>Verified purchase</p>}
          </aside>

          <article className={styles.body}>
            <p className={styles.excerpt}>{story.excerpt}</p>
            <blockquote className={styles.quote}>“{story.quote}”</blockquote>
            {story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className={styles.gallery}>
              {story.images.slice(1).map((image) => (
                <figure key={image.src} className={styles.figure}>
                  <div className={styles.figureMedia}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className={styles.figureImage}
                    />
                  </div>
                  <figcaption>{image.alt}</figcaption>
                </figure>
              ))}
            </div>
          </article>
        </div>
      </section>

      {watch && (
        <section className={styles.watch} aria-labelledby="watch-title">
          <div className={styles.watchInner}>
            <div className={styles.watchMedia}>
              <Image
                src={watch.images[0] ?? "/images/placeholder-watch.svg"}
                alt={watch.name}
                fill
                sizes="(max-width: 767px) 100vw, 38vw"
                className={styles.watchImage}
              />
            </div>
            <div className={styles.watchBody}>
              <p className={styles.kicker}>The watch in this story</p>
              <h2 id="watch-title">{watch.name}</h2>
              <p className={styles.watchMeta}>
                {["Ref. " + watch.ref, watch.year > 0 ? String(watch.year) : "", watch.condition, watch.setLabel]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className={styles.watchText}>{watch.shortDescription}</p>
              <div className={styles.watchActions}>
                <Link href={`/watches/${watch.slug}`} className={styles.watchLink}>
                  View reference →
                </Link>
                <span className={styles.watchPrice}>{formatPrice(watch.price)}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {next && next.slug !== story.slug && (
        <section className={styles.next}>
          <div className={styles.nextInner}>
            <span className={styles.kicker}>Next story</span>
            <Link href={`/stories/${next.slug}`} className={styles.nextLink}>
              {next.title} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
