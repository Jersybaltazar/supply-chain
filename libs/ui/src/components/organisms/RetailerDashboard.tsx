import { RetailerQuery } from '@foundation/network/src/queries/generated'
import { StatCard } from '../molecules/StatCard'
import { Description, Title2 } from '../atoms/typography'
import { getTranslations } from 'next-intl/server'

export const RetailerDashboard = async ({ retailer }: RetailerQuery) => {
  const t = await getTranslations('Dashboard')
  const tc = await getTranslations('Common')
  return (
    <div>
      <Title2>{t('retailerTitle')}</Title2>
      <Description className="text-sm">{t('retailerDesc')}</Description>
      <div className="flex gap-2 mt-4">
        <StatCard
          title={tc('warehouses')}
          href={'/retailer/warehouses'}
          count={retailer?.warehouses.length}
        />
      </div>
    </div>
  )
}
