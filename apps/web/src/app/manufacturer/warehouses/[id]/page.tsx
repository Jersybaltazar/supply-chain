import { fetchGraphQLServer } from '@foundation/network/src/fetch/server'
import {
  WarehouseDocument,
  namedOperations,
} from '@foundation/network/src/queries/generated'
import { Warehouse } from '@foundation/ui/src/components/templates/Warehouse'
import { getTranslations } from 'next-intl/server'

export default async function ProductPage({
  params,
}: {
  params: { id: number }
}) {
  const t = await getTranslations('Warehouses')
  const { data, error } = await fetchGraphQLServer({
    document: WarehouseDocument,
    variables: {
      where: { id: +params.id },
    },
    config: {
      next: {
        tags: [namedOperations.Query.warehouse],
      },
    },
  })

  if (!data?.warehouse) {
    return <div>{t('notFound')}</div>
  }

  return <Warehouse warehouse={data.warehouse} showUpsertInventory />
}
