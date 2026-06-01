import { ManufacturerQuery } from '@foundation/network/src/queries/generated'

import { DisplayUser } from '../molecules/DisplayUser'
import { Link } from '../molecules/CustomLink'
import { getTranslations } from 'next-intl/server'

export const ManufacturerMenu = async ({ manufacturer }: ManufacturerQuery) => {
  const t = await getTranslations('Common')
  const tm = await getTranslations('Menu')
  return (
    <div className="flex flex-col w-full max-w-xs gap-2">
      <DisplayUser size="lg" rounded="lg" className="mb-4" />

      <div className="flex flex-col gap-2">
        <Link href="/manufacturer">{t('panel')}</Link>
        <Link href="/manufacturer/products">{tm('manageProducts')}</Link>
        {manufacturer?.products.map((product) => (
          <Link
            href={`/manufacturer/products/${product.id}`}
            className="translate-x-4"
          >
            {product.name}
          </Link>
        ))}
        <Link href="/manufacturer/warehouses">{tm('manageWarehouses')}</Link>
        {manufacturer?.warehouses.map((warehouse) => (
          <Link
            href={`/manufacturer/warehouses/${warehouse.id}`}
            className="translate-x-4"
          >
            {warehouse.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
