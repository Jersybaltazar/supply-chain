import { getTranslations } from 'next-intl/server'

export default async function Loading() {
  const t = await getTranslations('Common')
  return <div>{t('loading')}</div>
}
