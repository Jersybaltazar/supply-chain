import { fetchGraphQLServer } from '@foundation/network/src/fetch/server'
import {
  ProductDocument,
  namedOperations,
} from '@foundation/network/src/queries/generated'
import { ProductFlow } from '@foundation/ui/src/components/organisms/ProductFlow'

import { ProductDetails } from '@foundation/ui/src/components/organisms/ProductDetails'
import { getTranslations } from 'next-intl/server'

export default async function ProductPage({
  params,
}: {
  params: { id: number }
}) {
  const t = await getTranslations('Products')
  const { data, error } = await fetchGraphQLServer({
    document: ProductDocument,
    variables: {
      where: { id: +params.id },
    },
    config: {
      next: {
        tags: [namedOperations.Query.product],
      },
    },
  })

  if (!data?.product) {
    return <div>{t('notFound')}</div>
  }

  return (
    <div className="space-y-6">
      <ProductDetails product={data.product} />
      <ProductFlow product={data.product} />
    </div>
  )
}
