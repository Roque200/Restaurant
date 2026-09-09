const CHAIN_LINKS = [
  { x: 185.0, y: 100.0, deg: 90.0, pin: { x: 182.1, y: 122.0 } },
  { x: 173.61, y: 142.5, deg: 120.0, pin: { x: 160.1, y: 160.1 } },
  { x: 142.5, y: 173.61, deg: 150.0, pin: { x: 122.0, y: 182.1 } },
  { x: 100.0, y: 185.0, deg: 180.0, pin: { x: 78.0, y: 182.1 } },
  { x: 57.5, y: 173.61, deg: 210.0, pin: { x: 39.9, y: 160.1 } },
  { x: 26.39, y: 142.5, deg: 240.0, pin: { x: 17.9, y: 122.0 } },
  { x: 15.0, y: 100.0, deg: 270.0, pin: { x: 17.9, y: 78.0 } },
  { x: 26.39, y: 57.5, deg: 300.0, pin: { x: 39.9, y: 39.9 } },
  { x: 57.5, y: 26.39, deg: 330.0, pin: { x: 78.0, y: 17.9 } },
  { x: 100.0, y: 15.0, deg: 360.0, pin: { x: 122.0, y: 17.9 } },
  { x: 142.5, y: 26.39, deg: 390.0, pin: { x: 160.1, y: 39.9 } },
  { x: 173.61, y: 57.5, deg: 420.0, pin: { x: 182.1, y: 78.0 } },
];

const TOOLS_PATH =
  "M 22.00 0.00 L 29.63 4.69 L 28.53 9.27 L 19.60 9.99 L 17.80 12.93 L 21.21 21.21 L 17.63 24.27 L 9.99 19.60 L 6.80 20.92 L 4.69 29.63 L 0.00 30.00 L -3.44 21.73 L -6.80 20.92 L -13.62 26.73 L -17.63 24.27 L -15.56 15.56 L -17.80 12.93 L -26.73 13.62 L -28.53 9.27 L -21.73 3.44 L -22.00 0.00 L -29.63 -4.69 L -28.53 -9.27 L -19.60 -9.99 L -17.80 -12.93 L -21.21 -21.21 L -17.63 -24.27 L -9.99 -19.60 L -6.80 -20.92 L -4.69 -29.63 L -0.00 -30.00 L 3.44 -21.73 L 6.80 -20.92 L 13.62 -26.73 L 17.63 -24.27 L 15.56 -15.56 L 17.80 -12.93 L 26.73 -13.62 L 28.53 -9.27 L 21.73 -3.44 Z";

/** Full circular badge mark: chain ring, gear + crossed tools, wordmark and tagline. */
export function LogoBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="98" fill="#0B0B0C" />
      <circle cx="100" cy="100" r="98" fill="none" stroke="#232527" strokeWidth="1" />
      <g>
        {CHAIN_LINKS.map((link, i) => (
          <g key={i}>
            <g transform={`translate(${link.x} ${link.y}) rotate(${link.deg})`}>
              <rect x="-7" y="-13" width="14" height="26" rx="7" fill="#F5F1EC" />
              <circle cx="0" cy="-8.6" r="4.2" fill="#0B0B0C" />
              <circle cx="0" cy="8.6" r="4.2" fill="#0B0B0C" />
            </g>
            <circle cx={link.pin.x} cy={link.pin.y} r="5" fill="#F5F1EC" />
            <circle cx={link.pin.x} cy={link.pin.y} r="2.1" fill="#0B0B0C" />
          </g>
        ))}
      </g>

      <path id="logoArcTop" d="M 43.62 79.48 A 60 60 0 0 1 156.38 79.48" fill="none" />
      <text
        fontSize="14"
        letterSpacing="1.8"
        fontWeight="700"
        fill="#F5F1EC"
        style={{ fontFamily: "var(--font-badge)" }}
      >
        <textPath href="#logoArcTop" startOffset="50%" textAnchor="middle">
          MEC&#193;NICOS
        </textPath>
      </text>

      <g transform="translate(100 92) scale(0.7)">
        <rect x="-46" y="-3.6" width="92" height="7.2" rx="3.6" fill="#F5F1EC" />
        <rect x="-53" y="-8" width="11" height="16" rx="2.5" fill="#F5F1EC" />
        <rect x="42" y="-8" width="11" height="16" rx="2.5" fill="#F5F1EC" />
        <path d={TOOLS_PATH} fill="#F5F1EC" />
        <g transform="translate(-30 33) rotate(20)">
          <rect x="-2.6" y="-24" width="5.2" height="22" fill="#F5F1EC" />
          <rect x="-9" y="-3" width="18" height="21" rx="3" fill="#F5F1EC" />
          <rect x="-9" y="1.5" width="18" height="2.4" fill="#0B0B0C" />
          <rect x="-9" y="6.5" width="18" height="2.4" fill="#0B0B0C" />
        </g>
        <g transform="translate(30 33) rotate(-20)">
          <rect x="-1.3" y="13" width="2.6" height="11" fill="#F5F1EC" />
          <rect x="-5.5" y="-9" width="11" height="22" rx="1.5" fill="#F5F1EC" />
          <rect x="-5.5" y="-4.5" width="11" height="2" fill="#0B0B0C" />
          <rect x="-5.5" y="0" width="11" height="2" fill="#0B0B0C" />
          <rect x="-5.5" y="4.5" width="11" height="2" fill="#0B0B0C" />
          <rect x="-7.5" y="-21" width="15" height="12" rx="1.5" fill="#F5F1EC" />
        </g>
        <g transform="rotate(-38)">
          <rect x="-4" y="-46" width="8" height="74" rx="4" fill="#F5F1EC" />
          <rect x="-16" y="-55" width="32" height="18" rx="4" fill="#F5F1EC" />
        </g>
        <g transform="rotate(38)">
          <rect x="-4" y="-46" width="8" height="74" rx="4" fill="#F5F1EC" />
          <circle cx="0" cy="-50" r="13.5" fill="none" stroke="#F5F1EC" strokeWidth="7" />
        </g>
        <circle cx="0" cy="0" r="5" fill="#0B0B0C" />
      </g>

      <text
        x="100"
        y="146"
        textAnchor="middle"
        fontSize="23"
        fontWeight="700"
        letterSpacing="1.5"
        fill="#F5F1EC"
        style={{ fontFamily: "var(--font-badge)" }}
      >
        BIKE
      </text>
      <text
        x="100"
        y="157"
        textAnchor="middle"
        fontSize="6.4"
        letterSpacing="1"
        fill="#A8A29E"
        style={{ fontFamily: "var(--font-badge)" }}
      >
        &mdash; PASI&Oacute;N EN 2 RUEDAS &mdash;
      </text>
      <text
        x="100"
        y="167"
        textAnchor="middle"
        fontSize="5.3"
        letterSpacing="0.4"
        fill="#6B6560"
        style={{ fontFamily: "var(--font-badge)" }}
      >
        APASEO EL GRANDE, GTO.
      </text>
    </svg>
  );
}

/** Compact icon-only mark for tight spaces like a favicon-sized nav slot. */
export function LogoMark({ className }: { className?: string }) {
  return <LogoBadge className={className} />;
}
