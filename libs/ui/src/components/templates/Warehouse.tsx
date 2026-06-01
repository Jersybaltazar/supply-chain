import { MyWarehousesQuery } from '@foundation/network/src/queries/generated'

import { UpsertInventory } from '../organisms/UpsertInventory'
import { TransactionsTable } from '../organisms/TransactionsTable'
import { InventoryCard } from '../organisms/InventoryCard'
import { WarehouseDetails } from '../organisms/WarehouseDetails'
import { getTranslations } from 'next-intl/server'

type WarehouseProps = {
  warehouse: MyWarehousesQuery['myWarehouses'][0]
  showUpsertInventory?: boolean
}

export const Warehouse = async ({
  warehouse,
  showUpsertInventory = false,
}: WarehouseProps) => {
  const t = await getTranslations('Warehouse')
  return (
    <div className="space-y-8">
      <WarehouseDetails warehouse={warehouse} />

      <div>
        <div className="flex items-center gap-2 mt-4 mb-2 ">
          <div className="font-semibold">{t('inventory')}</div>
          {showUpsertInventory ? (
            <UpsertInventory warehouse={warehouse} />
          ) : null}
        </div>
        {warehouse.inventories.length === 0 ? <div>{t('empty')}</div> : null}
        <div className="flex flex-wrap gap-4">
          {warehouse.inventories.map((inventory) => (
            <InventoryCard
              inventory={inventory}
              key={inventory.product.id}
              warehouseId={warehouse.id}
            />
          ))}
        </div>
      </div>
      {warehouse.ins.length ? (
        <div>
          <div>{t('ins')}</div>
          <TransactionsTable transactions={warehouse.ins} />
        </div>
      ) : null}
      {warehouse.outs.length ? (
        <div>
          <div>{t('outs')}</div>
          <TransactionsTable transactions={warehouse.outs} />
        </div>
      ) : null}
    </div>
  )
}
