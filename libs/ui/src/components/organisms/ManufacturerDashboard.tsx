import { ManufacturerQuery } from '@foundation/network/src/queries/generated'
import { StatCard } from '../molecules/StatCard'
import { Description, Title2 } from '../atoms/typography'
import { getTranslations } from 'next-intl/server'

export const ManufacturerDashboard = async ({
  manufacturer,
}: ManufacturerQuery) => {
  const t = await getTranslations('Dashboard')
  const tc = await getTranslations('Common')
  return (
    <div>
      <Title2>{t('manufacturerTitle')}</Title2>
      <Description className="text-sm">{t('manufacturerDesc')}</Description>
      <div className="flex gap-2 mt-4">
        <StatCard
          title={tc('products')}
          count={manufacturer?.products.length}
          href={'/manufacturer/products'}
        />
        <StatCard
          title={tc('warehouses')}
          href={'/manufacturer/warehouses'}
          count={manufacturer?.warehouses.length}
        />
      </div>
    </div>
  )
}
