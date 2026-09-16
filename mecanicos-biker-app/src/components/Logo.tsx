import Image from "next/image";

const LOGO_SRC = "/logo-mecanicos-biker.png";
// Intrinsic size of the source file — required by next/image, overridden on
// screen by whatever h-*/w-* the caller passes in `className`.
const LOGO_WIDTH = 720;
const LOGO_HEIGHT = 716;

/**
 * The client's official logo artwork (transparent background), used exactly
 * as provided. Its line art is black, so on a dark surface it needs a light
 * backing to stay legible — this adds a plain circle behind the badge ring,
 * never touching the artwork's own pixels. On a white surface the circle is
 * invisible against the page, so this is safe everywhere the mark appears.
 */
function LogoGlyph({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span className="absolute inset-[6%] rounded-full bg-white" aria-hidden="true" />
      <Image
        src={LOGO_SRC}
        alt="Mecánicos Biker"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className="absolute inset-0 h-full w-full"
        priority={priority}
      />
    </span>
  );
}

/** Full badge, used large (e.g. the hero) — loaded eagerly since it's likely above the fold. */
export function LogoBadge({ className }: { className?: string }) {
  return <LogoGlyph className={className} priority />;
}

/** Same artwork, used in tight spaces like a nav slot. */
export function LogoMark({ className }: { className?: string }) {
  return <LogoGlyph className={className} />;
}
