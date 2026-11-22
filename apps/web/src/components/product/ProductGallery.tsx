"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@oudyn/contracts";
import { isPlaceholderImage } from "@/lib/images";
import styles from "./ProductGallery.module.css";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const panels = useRef<Array<HTMLElement | null>>([]);
  const images = product.images.length > 0 ? product.images : ["/images/placeholder-watch.svg"];

  useEffect(() => {
    const nodes = panels.current.filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index ?? 0);
            setActive(index);
          }
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [images.length]);

  const goTo = (index: number) => {
    panels.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.gallery} id="gallery" aria-label={`${product.name} images`}>
      <div className={styles.stack}>
        {images.map((src, index) => (
          <figure
            key={`${src}-${index}`}
            id={`view-${index + 1}`}
            data-index={index}
            ref={(node) => {
              panels.current[index] = node;
            }}
            className={styles.panel}
            data-first={index === 0 || undefined}
          >
            <Image
              src={src}
              alt={
                isPlaceholderImage(src)
                  ? "Placeholder photograph — actual watch photographs are available on request"
                  : `${product.name}, ${product.subtitle}`
              }
              fill
              sizes="(max-width: 1023px) 100vw, 73vw"
              priority={index === 0}
              className={styles.image}
            />
            {index === 0 && isPlaceholderImage(src) && (
              <figcaption className={styles.note}>
                Placeholder image — actual watch photographs on request
              </figcaption>
            )}
            {index === 0 && images.length > 1 && (
              <div className={styles.dots} role="group" aria-label="Image navigation">
                {images.map((item, dotIndex) => (
                  <button
                    key={`${item}-dot-${dotIndex}`}
                    type="button"
                    className={styles.dot}
                    data-active={dotIndex === active || undefined}
                    onClick={() => goTo(dotIndex)}
                    aria-label={`Go to image ${dotIndex + 1}`}
                    aria-current={dotIndex === active || undefined}
                  />
                ))}
              </div>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
