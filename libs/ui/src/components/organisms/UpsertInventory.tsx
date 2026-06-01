'use client'
import { WarehouseDetailsFragment } from '@foundation/network/src/queries/generated'

import { useFormUpsertInventory } from '@foundation/forms/src/upsertInventory'
import { Input } from '../atoms/input'
import { Label } from '../atoms/label'

import { upsertInventory } from '@foundation/network/src/actions/upsertInventory'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../atoms/button'
import { SelectProducts } from '../molecules/SelectProducts'
import { SimpleDialog } from '../molecules/SimpleDialog'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export const UpsertInventory = ({
  warehouse,
}: {
  warehouse: WarehouseDetailsFragment
}) => {
  const t = useTranslations('Inventory')
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useFormUpsertInventory()

  const [close, setClose] = useState(false)

  return (
    <SimpleDialog
      close={close}
      buttonText={
        <div className="p-1 bg-black rounded-full shadow-md">
          <Plus className="p-1 text-white " />
        </div>
      }
    >
      {warehouse.name}
      <form
        onSubmit={handleSubmit(async ({ productId, quantity, warehouseId }) => {
          try {
            await upsertInventory({ productId, quantity, warehouseId })
            toast.success(t('inventoryUpdated'))
            reset()
            setClose(true)
          } catch (e) {
            toast.error(t('inventoryFailed'))
          }
        })}
      >
        <Label title={t('product')} error={errors.productId?.message}>
          <SelectProducts
            onSelect={function (productId: number): void {
              setValue('productId', productId)
            }}
            manufacturerId={warehouse.id}
          />
        </Label>
        <Label title={t('quantity')} error={errors.quantity?.message}>
          <Input {...register('quantity', { valueAsNumber: true })} />
        </Label>
        <Label title={t('warehouseIdReadonly')}>
          <Input
            {...register('warehouseId', { valueAsNumber: true })}
            readOnly
            value={warehouse.id}
          />
        </Label>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('saving') : t('submit')}
        </Button>
      </form>
    </SimpleDialog>
  )
}
