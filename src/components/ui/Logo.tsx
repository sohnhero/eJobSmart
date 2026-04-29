interface LogoProps {
  /** 'icon' = briefcase+bolt only, 'full' = icon + wordmark, 'wordmark' = text only */
  variant?: 'icon' | 'full' | 'wordmark'
  /** Overall height in px — width scales automatically */
  size?: number
  /** Use white text/icon for dark backgrounds */
  inverted?: boolean
  className?: string
}

/**
 * eJobSmart SVG Logo — renders crisply at any size.
 * Icon: blue briefcase with amber lightning bolt.
 * Wordmark: "e" dark · "Job" blue · "Smart" dark.
 */
export default function Logo({ variant = 'full', size = 32, inverted = false, className = '' }: LogoProps) {
  const textColor = inverted ? '#ffffff' : '#1e293b'
  const blueColor = '#2563eb'
  const amberColor = '#f59e0b'
  const iconBg = inverted ? 'rgba(255,255,255,0.12)' : '#2563eb'

  const Icon = ({ h }: { h: number }) => {
    const w = h
    return (
      <svg width={w} height={h} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rounded square background */}
        <rect width="40" height="40" rx="10" fill={iconBg} />
        {/* Briefcase body */}
        <rect x="7" y="15" width="26" height="18" rx="3" fill={inverted ? 'rgba(255,255,255,0.9)' : 'white'} />
        {/* Briefcase handle */}
        <path
          d="M15 15V13C15 11.3 16.3 10 18 10H22C23.7 10 25 11.3 25 13V15"
          stroke={inverted ? 'rgba(255,255,255,0.9)' : 'white'}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Briefcase middle clasp line */}
        <rect x="7" y="21" width="26" height="2" fill={inverted ? 'rgba(255,255,255,0.25)' : `${blueColor}30`} />
        {/* Lightning bolt — amber accent */}
        <path
          d="M22 14L15.5 23H20L18 33L26.5 21H22L24.5 14Z"
          fill={amberColor}
          stroke="white"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (variant === 'icon') {
    return <Icon h={size} />
  }

  const iconH = size
  const fontSize = size * 0.65
  const gap = size * 0.28

  if (variant === 'wordmark') {
    return (
      <svg
        height={size}
        viewBox={`0 0 ${fontSize * 6.0} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          y={size * 0.78}
          fontFamily="'Inter', 'Poppins', sans-serif"
          fontWeight="800"
          fontSize={fontSize}
          letterSpacing="-0.5"
        >
          <tspan fill={textColor}>e</tspan>
          <tspan fill={blueColor}>Job</tspan>
          <tspan fill={textColor}>Smart</tspan>
        </text>
      </svg>
    )
  }

  // Full variant — icon + wordmark side by side
  const textW = fontSize * 6.0
  const totalW = iconH + gap + textW

  return (
    <svg
      width={totalW}
      height={iconH}
      viewBox={`0 0 ${totalW} ${iconH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="eJobSmart"
    >
      {/* Icon group */}
      <g>
        {/* Rounded square background */}
        <rect width={iconH} height={iconH} rx={iconH * 0.25} fill={inverted ? 'rgba(255,255,255,0.15)' : blueColor} />
        {/* Briefcase body */}
        <rect
          x={iconH * 0.175}
          y={iconH * 0.375}
          width={iconH * 0.65}
          height={iconH * 0.45}
          rx={iconH * 0.075}
          fill={inverted ? 'rgba(255,255,255,0.9)' : 'white'}
        />
        {/* Briefcase handle */}
        <path
          d={`M${iconH * 0.375} ${iconH * 0.375}V${iconH * 0.325}C${iconH * 0.375} ${iconH * 0.275} ${iconH * 0.408} ${iconH * 0.25} ${iconH * 0.45} ${iconH * 0.25}H${iconH * 0.55}C${iconH * 0.592} ${iconH * 0.25} ${iconH * 0.625} ${iconH * 0.275} ${iconH * 0.625} ${iconH * 0.325}V${iconH * 0.375}`}
          stroke={inverted ? 'rgba(255,255,255,0.9)' : 'white'}
          strokeWidth={iconH * 0.055}
          strokeLinecap="round"
          fill="none"
        />
        {/* Lightning bolt */}
        <path
          d={`M${iconH * 0.55} ${iconH * 0.35}L${iconH * 0.385} ${iconH * 0.575}H${iconH * 0.5}L${iconH * 0.45} ${iconH * 0.825}L${iconH * 0.665} ${iconH * 0.525}H${iconH * 0.55}L${iconH * 0.6125} ${iconH * 0.35}Z`}
          fill={amberColor}
          stroke="white"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Wordmark text */}
      <text
        x={iconH + gap}
        y={iconH * 0.775}
        fontFamily="'Inter', 'Poppins', system-ui, sans-serif"
        fontWeight="800"
        fontSize={fontSize}
        letterSpacing="-0.3"
      >
        <tspan fill={inverted ? 'rgba(255,255,255,0.9)' : textColor}>e</tspan>
        <tspan fill={inverted ? 'rgba(255,255,255,1)' : blueColor}>Job</tspan>
        <tspan fill={inverted ? 'rgba(255,255,255,0.9)' : textColor}>Smart</tspan>
      </text>
    </svg>
  )
}
