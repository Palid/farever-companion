import Image from "next/image";

interface ScreenshotProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  caption?: string;
}

export function Screenshot({ src, alt, width, height, className, caption }: ScreenshotProps) {
  if (!src) {
    const aspectPadding = `${((height / width) * 100).toFixed(2)}%`;
    return (
      <div>
        <div
          className="bg-surface-elevated border border-border-strong rounded-lg flex items-center justify-center text-subtle text-xs font-mono"
          style={{ paddingBottom: aspectPadding, position: "relative" }}
          role="img"
          aria-label={alt}
        >
          <span style={{ position: "absolute" }}>screenshot pending</span>
        </div>
        {caption && (
          <p className="mt-2 text-xs text-subtle">{caption}</p>
        )}
      </div>
    );
  }

  if (caption) {
    return (
      <figure>
        <Image src={src} alt={alt} width={width} height={height} className={className} />
        <figcaption className="mt-2 text-xs text-subtle">{caption}</figcaption>
      </figure>
    );
  }

  return <Image src={src} alt={alt} width={width} height={height} className={className} />;
}
