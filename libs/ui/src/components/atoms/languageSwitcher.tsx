'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { cn } from '../../util'

const LOCALES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
]

export const LanguageSwitcher = () => {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const changeLocale = (next: string) => {
    if (next === locale) return
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`
    startTransition(() => router.refresh())
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {LOCALES.map(({ code, label }, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 ? <span className="opacity-30">·</span> : null}
          <button
            type="button"
            disabled={isPending}
            onClick={() => changeLocale(code)}
            className={cn(
              'transition-opacity hover:opacity-100',
              locale === code
                ? 'font-semibold underline underline-offset-4'
                : 'opacity-50',
            )}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  )
}
