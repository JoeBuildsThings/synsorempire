"use client";

import { useState } from "react";

type Img = { main: string; thumb: string };

export default function ProductGallery({
  images,
  name,
}: {
  images: Img[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return <div className="galleryMain" />;

  return (
    <div className="gallery">
      <div className="galleryMain">
        <img
          src={images[active].main}
          alt={`${name}, photo ${active + 1} of ${images.length}`}
          width={900}
          height={1125}
        />
      </div>
      {images.length > 1 && (
        <ul className="thumbs">
          {images.map((img, i) => (
            <li key={img.thumb}>
              <button
                type="button"
                className={i === active ? "thumb thumbOn" : "thumb"}
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === active}
              >
                <img src={img.thumb} alt="" width={160} height={160} loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}