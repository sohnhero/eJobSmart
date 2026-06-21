interface LogoProps {
  /** 'icon' = icône job uniquement, 'full' = logo complet, 'wordmark' = texte uniquement */
  variant?: 'icon' | 'full' | 'wordmark'
  /** Hauteur globale en px */
  size?: number
  /** Texte blanc pour fonds sombres */
  inverted?: boolean
  className?: string
}

/**
 * Eureka Job SVG Logo — fidèle à la charte graphique officielle.
 * "EUREKA" en Poppins dark + "Job" en Poppins bold bleu + underline cyan.
 * Avec séparateur vertical et "Talents & Advisory" pour la variante full.
 */
export default function Logo({ variant = 'full', size = 40, inverted = false, className = '' }: LogoProps) {
  const darkColor = inverted ? '#ffffff' : '#0F1E3A'
  const blueColor = inverted ? '#ffffff' : '#2563EB'
  const cyanColor = '#39D5F4'
  const separatorColor = inverted ? 'rgba(255,255,255,0.4)' : '#CBD5E1'
  const subtitleColor = inverted ? 'rgba(255,255,255,0.85)' : '#0F1E3A'

  /* ── Icon variant: rounded square "Job" ── */
  if (variant === 'icon') {
    const s = size
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Eureka Job">
        <rect width="40" height="40" rx="10" fill="#2563EB" />
        <text
          x="20" y="27"
          fontFamily="'Poppins', sans-serif"
          fontWeight="700"
          fontSize="18"
          fill="white"
          textAnchor="middle"
          letterSpacing="-0.5"
        >
          Job
        </text>
        {/* Cyan underline */}
        <path d="M8 32 Q20 35 32 32" stroke={cyanColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    )
  }

  /* ── Wordmark variant: EUREKA Job text only ── */
  if (variant === 'wordmark') {
    const h = size
    const eurekaSize = h * 0.35
    const jobSize = h * 0.7
    return (
      <svg
        height={h}
        viewBox={`0 0 ${h * 3.5} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Eureka Job"
      >
        <text
          x="0"
          y={h * 0.42}
          fontFamily="'Poppins', sans-serif"
          fontWeight="700"
          fontSize={eurekaSize}
          fill={darkColor}
          letterSpacing="2"
        >
          EUREKA
        </text>
        <text
          x="2"
          y={h * 0.9}
          fontFamily="'Poppins', sans-serif"
          fontWeight="800"
          fontSize={jobSize}
          fill={blueColor}
          letterSpacing="-1"
        >
          Job
        </text>
        {/* Cyan underline arc */}
        <path
          d={`M2 ${h * 0.95} Q${h * 1.0} ${h * 1.05} ${h * 1.85} ${h * 0.95}`}
          stroke={cyanColor}
          strokeWidth={h * 0.06}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    )
  }

  /* ── Full variant: EUREKA + Job + | + Talents & Advisory ── */
  const h = size
  const eurekaSize = h * 0.30
  const jobSize = h * 0.62
  const subtitleSize = h * 0.22
  const logoBlockW = h * 1.9
  const totalW = logoBlockW + h * 0.08 + h * 0.04 + h * 2.2 /* sep + gap + subtitle */

  return (
    <svg
      width={totalW}
      height={h}
      viewBox={`0 0 ${totalW} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Eureka Job | Talents & Advisory"
    >
      {/* EUREKA text */}
      <text
        x="0"
        y={h * 0.38}
        fontFamily="'Poppins', sans-serif"
        fontWeight="700"
        fontSize={eurekaSize}
        fill={darkColor}
        letterSpacing="1.5"
      >
        EUREKA
      </text>

      {/* Job text */}
      <text
        x="0"
        y={h * 0.88}
        fontFamily="'Poppins', sans-serif"
        fontWeight="800"
        fontSize={jobSize}
        fill={blueColor}
        letterSpacing="-0.5"
      >
        Job
      </text>

      {/* Cyan underline arc */}
      <path
        d={`M1 ${h * 0.95} Q${logoBlockW * 0.5} ${h * 1.04} ${logoBlockW - 2} ${h * 0.95}`}
        stroke={cyanColor}
        strokeWidth={h * 0.055}
        strokeLinecap="round"
        fill="none"
      />

      {/* Vertical separator */}
      <line
        x1={logoBlockW + h * 0.08}
        y1={h * 0.12}
        x2={logoBlockW + h * 0.08}
        y2={h * 0.88}
        stroke={separatorColor}
        strokeWidth="1"
      />

      {/* Talents & Advisory */}
      <text
        x={logoBlockW + h * 0.2}
        y={h * 0.46}
        fontFamily="'Poppins', sans-serif"
        fontWeight="500"
        fontSize={subtitleSize}
        fill={subtitleColor}
      >
        Talents &amp;
      </text>
      <text
        x={logoBlockW + h * 0.2}
        y={h * 0.72}
        fontFamily="'Poppins', sans-serif"
        fontWeight="500"
        fontSize={subtitleSize}
        fill={subtitleColor}
      >
        Advisory
      </text>
    </svg>
  )
}
