import { getTranslations } from 'next-intl/server'

export default async function Loading() {
  const t = await getTranslations('Warehouses')
  return <div>{t('loading')}</div>
}
