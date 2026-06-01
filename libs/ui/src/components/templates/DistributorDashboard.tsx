import { DistributorQuery } from '@foundation/network/src/queries/generated'
import { StatCard } from '../molecules/StatCard'
import { Description, Title2 } from '../atoms/typography'
import { getTranslations } from 'next-intl/server'

export const DistributorDashboard = async ({
  distributor,
}: DistributorQuery) => {
  const t = await getTranslations('Dashboard')
  const tc = await getTranslations('Common')
  return (
    <div>
      <Title2>{t('distributorTitle')}</Title2>
      <Description className="text-sm">{t('distributorDesc')}</Description>
      <div className="flex gap-2 mt-4">
        <StatCard
          title={tc('warehouses')}
          href={'/distributor/warehouses'}
          count={distributor?.warehouses.length}
        />
      </div>
    </div>
  )
}
