import { fetchGraphQLServer } from '@foundation/network/src/fetch/server'
import {
  MyWarehousesDocument,
  SortOrder,
  namedOperations,
} from '@foundation/network/src/queries/generated'
import Link from 'next/link'
import { WarehouseDetails } from '@foundation/ui/src/components/organisms/WarehouseDetails'
import { getAuth } from '@foundation/network/src/auth/authOptions'
import { getTranslations } from 'next-intl/server'

export default async function WarehousesPage() {
  const t = await getTranslations('Warehouses')
  const tc = await getTranslations('Common')
  const user = await getAuth()
  const { data, error } = await fetchGraphQLServer({
    document: MyWarehousesDocument,
    variables: {
      orderBy: { createdAt: SortOrder.Desc },
      where: { distributorId: { equals: user?.user?.uid } },
    },
    config: {
      next: {
        tags: [namedOperations.Query.myWarehouses],
      },
    },
  })

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div>{t('title')}</div>
        <Link href="/distributor/warehouses/new">{tc('new')}</Link>
      </div>
      {data?.myWarehouses.length === 0 ? <div>{t('empty')}</div> : null}

      {data?.myWarehouses.map((warehouse) => (
        <Link
          href={`/distributor/warehouses/${warehouse.id}`}
          key={warehouse.id}
        >
          <WarehouseDetails warehouse={warehouse} mapLink={false} />
        </Link>
      ))}
    </div>
  )
}
