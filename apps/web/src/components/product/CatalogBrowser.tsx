"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product, ProductFacets, ProductListResponse } from "@oudyn/contracts";
import { ProductCard } from "@/components/product/ProductCard";
import { useRomeClock } from "@/components/time/useRomeClock";
import { ChevronDownIcon } from "@/components/visual/Icons";
import { clientProducts } from "@/lib/client-api";
import styles from "./CatalogBrowser.module.css";

type LineupItem = { label: string; count: number; href: string };

type Props = {
  initial: ProductListResponse;
  collection?: string;
  category?: string;
  search?: string;
  initialTag?: string;
  initialSort?: string;
  title: string;
  description?: string;
  showHead?: boolean;
  hero?: boolean;
  lineup?: LineupItem[];
  services?: boolean;
};

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
];

function CaseIcon() {
  return (
    <svg viewBox="0 0 120 150" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M42 14h36v22H42zM42 114h36v22H42z" />
        <path d="M42 28c-12 8-20 22-20 42v10c0 20 8 34 20 42M78 28c12 8 20 22 20 42v10c0 20-8 34-20 42" />
        <circle cx="60" cy="75" r="31" />
        <circle cx="60" cy="75" r="23" strokeOpacity="0.4" />
        <path d="M91 67h7v16h-7z" />
      </g>
    </svg>
  );
}

export function CatalogBrowser({
  initial,
  collection,
  category,
  search,
  initialTag = "",
  initialSort = "featured",
  title,
  description,
  showHead = true,
  hero = false,
  lineup,
  services = false,
}: Props) {
  const [tag, setTag] = useState(initialTag);
  const [sort, setSort] = useState(initialSort);
  const [query, setQuery] = useState(search ?? "");
  const [items, setItems] = useState<Product[]>(initial.items);
  const [facets, setFacets] = useState<ProductFacets>(initial.facets);
  const [total, setTotal] = useState(initial.total);
  const [nextCursor, setNextCursor] = useState<string | null>(initial.nextCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menu, setMenu] = useState<"filter" | "sort" | null>(null);
  const { mounted, clock, weather } = useRomeClock();

  useEffect(() => {
    const url = new URL(window.location.href);
    const nextQuery = url.searchParams.get("q")?.trim() ?? "";
    const nextTag = url.searchParams.get("tag")?.toUpperCase() ?? "";
    const nextSort = url.searchParams.get("sort") ?? "featured";
    if (!nextQuery && !nextTag && nextSort === "featured") return;

    setQuery(nextQuery);
    setTag(nextTag);
    setSort(nextSort);
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (collection) params.set("collection", collection);
    if (category) params.set("category", category);
    if (nextQuery) params.set("search", nextQuery);
    if (nextTag) params.set("tag", nextTag);
    params.set("sort", nextSort);
    params.set("limit", "12");
    clientProducts(params)
      .then((data) => {
        setItems(data.items);
        setFacets(data.facets);
        setTotal(data.total);
        setNextCursor(data.nextCursor);
      })
      .catch(() => setError("The catalog did not respond. Try again."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paramsFor = (cursor?: string | null, nextTag = tag, nextSort = sort) => {
    const params = new URLSearchParams();
    if (collection) params.set("collection", collection);
    if (category) params.set("category", category);
    if (query) params.set("search", query);
    if (nextTag) params.set("tag", nextTag);
    if (nextSort) params.set("sort", nextSort);
    params.set("limit", "12");
    if (cursor) params.set("cursor", cursor);
    return params;
  };

  const reload = (nextTag: string, nextSort: string) => {
    setTag(nextTag);
    setSort(nextSort);
    setMenu(null);
    setLoading(true);
    setError("");
    clientProducts(paramsFor(null, nextTag, nextSort))
      .then((data) => {
        setItems(data.items);
        setFacets(data.facets);
        setTotal(data.total);
        setNextCursor(data.nextCursor);
      })
      .catch(() => setError("The catalog did not respond. Try again."))
      .finally(() => setLoading(false));

    const url = new URL(window.location.href);
    if (nextTag) url.searchParams.set("tag", nextTag);
    else url.searchParams.delete("tag");
    if (nextSort !== "featured") url.searchParams.set("sort", nextSort);
    else url.searchParams.delete("sort");
    window.history.replaceState(null, "", url.toString());
  };

  const loadMore = () => {
    if (!nextCursor || loading) return;
    setLoading(true);
    setError("");
    clientProducts(paramsFor(nextCursor))
      .then((data) => {
        setItems((current) => [...current, ...data.items]);
        setNextCursor(data.nextCursor);
      })
      .catch(() => setError("The next page did not load. Try again."))
      .finally(() => setLoading(false));
  };

  const filters = facets.tags.filter((item) => item.value !== "NEW");
  const sortLabel = SORTS.find((option) => option.value === sort)?.label ?? "Sort by";
  const heading = query ? `Search results for “${query}”` : title;

  const tools = (
    <div className={hero ? styles.heroTools : styles.toolbarTools}>
      <div className={styles.menuWrap}>
        <button
          type="button"
          className={styles.pill}
          data-active={Boolean(tag) || undefined}
          aria-expanded={menu === "filter"}
          onClick={() => setMenu(menu === "filter" ? null : "filter")}
        >
          <span className={styles.pillDot} aria-hidden="true" />
          {tag || "Filter by"}
          <ChevronDownIcon size={11} />
        </button>
        {menu === "filter" && (
          <div className={styles.menu}>
            <p className={styles.menuTitle}>Movement</p>
            <button
              type="button"
              className={styles.menuItem}
              data-active={tag === "" || undefined}
              onClick={() => reload("", sort)}
            >
              <span>All references</span>
              <span>{initial.total}</span>
            </button>
            {filters.map((facet) => (
              <button
                key={facet.value}
                type="button"
                className={styles.menuItem}
                data-active={tag === facet.value || undefined}
                onClick={() => reload(facet.value === tag ? "" : facet.value, sort)}
              >
                <span>{facet.value}</span>
                <span>{facet.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.menuWrap}>
        <button
          type="button"
          className={styles.pill}
          aria-expanded={menu === "sort"}
          onClick={() => setMenu(menu === "sort" ? null : "sort")}
        >
          <span className={styles.pillDot} aria-hidden="true" />
          {sortLabel}
          <ChevronDownIcon size={11} />
        </button>
        {menu === "sort" && (
          <div className={`${styles.menu} ${styles.sortMenu}`}>
            <p className={styles.menuTitle}>Order</p>
            {SORTS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={styles.menuItem}
                data-active={sort === option.value || undefined}
                onClick={() => reload(tag, option.value)}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.catalog}>
      {hero ? (
        <section className={styles.hero} aria-labelledby="page-title">
          <Image
            src="/images/rolex/rolex-dark.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroInner}>
            <div className={styles.heroTop}>
              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <span aria-current="page">{title}</span>
              </nav>
              {tools}
            </div>
            <div className={styles.heroCopy}>
              <h1 className={styles.heroTitle} id="page-title">
                {search
                  ? `Search results for “${search}”`
                  : "Pre-owned Rolex, independently inspected in Hong Kong."}
              </h1>
              <div className={styles.heroMeta}>
                <span>
                  {mounted && clock ? clock.time : "--:--:--"}
                  <br />
                  Hong Kong
                  <br />
                  {mounted && weather ? `${weather.temperature}° ${weather.label}` : "Local weather"}
                </span>
                <span>
                  {String(total).padStart(2, "0")}
                  <br />
                  Products
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        showHead && (
          <header className={styles.head}>
            <h1 className={styles.title}>{heading}</h1>
            <p className={styles.count}>
              {String(total).padStart(2, "0")} {total === 1 ? "reference" : "references"}
            </p>
          </header>
        )
      )}

      {hero && <div className={styles.mobileToolbar}>{tools}</div>}

      {!hero && description && <p className={styles.description}>{description}</p>}
      {!hero && <div className={styles.toolbar}>{tools}</div>}
      {hero && description && <p className={styles.heroDescription}>{description}</p>}

      {lineup && lineup.length > 0 && (
        <nav className={styles.lineup} aria-label="Collections">
          {lineup.map((item) => (
            <Link key={item.label} href={item.href} className={styles.lineupItem}>
              <CaseIcon />
              <span className={styles.lineupName}>{item.label}</span>
              <span className={styles.lineupCount}>{item.count} {item.count === 1 ? "Product" : "Products"}</span>
            </Link>
          ))}
        </nav>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.listing}>
        {items.length === 0 && !loading ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Nothing matches this combination.</p>
            <p className={styles.emptyText}>Clear the filter to see every reference.</p>
            <button type="button" className={styles.emptyAction} onClick={() => reload("", sort)}>
              Clear filter
            </button>
          </div>
        ) : (
          <div className={styles.grid} data-loading={loading || undefined}>
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {loading &&
              Array.from({ length: 4 }, (_, index) => (
                <div key={`skeleton-${index}`} className={styles.skeleton} aria-hidden="true" />
              ))}
          </div>
        )}

        {nextCursor && (
          <div className={styles.moreRow}>
            <button type="button" className={styles.more} onClick={loadMore} disabled={loading}>
              {loading ? "Loading" : "Show more"}
            </button>
          </div>
        )}
      </div>

      {services && (
        <section className={styles.services} aria-label="Service promises">
          <div>
            <h2>Documented condition</h2>
            <p>Condition, set contents and known faults are written down before sale.</p>
          </div>
          <div>
            <h2>14-day return right</h2>
            <p>Where applicable. Read the Shipping &amp; Returns page for conditions.</p>
          </div>
          <div>
            <h2>Worldwide shipping</h2>
            <p>Cost, insurance and import taxes are confirmed before payment.</p>
          </div>
        </section>
      )}
    </div>
  );
}
