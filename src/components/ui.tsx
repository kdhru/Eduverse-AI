import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function Glass({ children, className = '', hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`glass rounded-3xl ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-20px_rgba(93,95,160,0.45)]' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function Chip({ children, tone = 'peri', className = '' }: { children: ReactNode; tone?: 'peri' | 'lilac' | 'sky' | 'mint' | 'blush' | 'butter' | 'ink'; className?: string }) {
  const tones: Record<string, string> = {
    peri: 'bg-peri-soft text-peri-deep',
    lilac: 'bg-lilac-soft text-[#7a63b8]',
    sky: 'bg-sky-soft text-[#4a7fb5]',
    mint: 'bg-mint-soft text-[#3d9a6e]',
    blush: 'bg-blush-soft text-[#c76a92]',
    butter: 'bg-butter-soft text-[#b08b2e]',
    ink: 'bg-[#eeedf5] text-ink-soft',
  }
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}>{children}</span>
}

export function Ring({ value, size = 72, stroke = 7, color = '#7d88e6', track = '#eceefc', label, sub }: {
  value: number; size?: number; stroke?: number; color?: string; track?: string; label?: ReactNode; sub?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (value / 100) * c }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-ink" style={{ fontSize: size / 4.2 }}>{label ?? `${value}%`}</span>
        {sub && <span className="text-[9px] font-medium text-muted">{sub}</span>}
      </div>
    </div>
  )
}

export function Bar({ value, color = '#7d88e6', className = '' }: { value: number; color?: string; className?: string }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-[#eceaf6] ${className}`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  )
}

export function PageHead({ crumbs, title, subtitle, actions }: { crumbs: string[]; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted">
          {crumbs.map((c, i) => (
            <span key={c} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-line">/</span>}
              <span className={i === crumbs.length - 1 ? 'text-peri-deep' : ''}>{c}</span>
            </span>
          ))}
        </div>
        <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.6, 0.35, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${on ? 'bg-peri' : 'bg-[#dcdaec]'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${on ? 'left-[1.4rem]' : 'left-0.5'}`} />
    </button>
  )
}
