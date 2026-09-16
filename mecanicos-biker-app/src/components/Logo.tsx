import Image from "next/image";

const LOGO_SRC = "/logo-mecanicos-biker.png";
// Intrinsic size of the source file — required by next/image, overridden on
// screen by whatever h-*/w-* the caller passes in `className`.
const LOGO_WIDTH = 720;
const LOGO_HEIGHT = 716;

/** The client's official logo artwork, used exactly as provided. */
export function LogoBadge({ className }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Mecánicos Biker"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={className}
      priority
    />
  );
}

/** Same artwork, used in tight spaces like a nav slot. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image src={LOGO_SRC} alt="Mecánicos Biker" width={LOGO_WIDTH} height={LOGO_HEIGHT} className={className} />
  );
}
