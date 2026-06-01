'use client'
import { useState } from 'react'

import { useFormSellInventory } from '@foundation/forms/src/sellInventory'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import {
  MyWarehousesQuery,
  ReduceInventoryDocument,
  namedOperations,
} from '@foundation/network/src/queries/generated'
import { Button } from '../atoms/button'
import { SimpleDialog } from '../molecules/SimpleDialog'
import { fetchGraphQLClient } from '@foundation/network/src/fetch/client'
import { revalidate } from '@foundation/network/src/actions/revalidate'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export const SellGoods = ({
  warehouseId,
  inventory,
}: {
  warehouseId: number
  inventory: MyWarehousesQuery['myWarehouses'][0]['inventories'][0]
}) => {
  const t = useTranslations('Inventory')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormSellInventory()
  const [close, setClose] = useState(false)

  return (
    <SimpleDialog
      close={close}
      buttonText={
        <div className=" hover:underline underline-offset-4">{t('sell')}</div>
      }
    >
      <div>{inventory.product.name}</div>
      <div>{inventory.quantity}</div>
      <form
        onSubmit={handleSubmit(async ({ productId, quantity, warehouseId }) => {
          const { data, error } = await fetchGraphQLClient({
            document: ReduceInventoryDocument,
            variables: {
              warehouseId,
              productId,
              quantity,
            },
          })

          if (data) {
            revalidate(namedOperations.Query.myWarehouses)
            toast.success(t('sellSuccess'))
            setClose(true)
            reset()
            return
          }
          if (error) {
            toast.error(t('sellFailed'))
          }
        })}
      >
        <Label title={t('quantity')} error={errors.quantity?.message}>
          <Input {...register('quantity', { valueAsNumber: true })} />
        </Label>
        <Label title={t('warehouseIdReadonly')}>
          <Input
            {...register('warehouseId', { valueAsNumber: true })}
            readOnly
            value={warehouseId}
          />
        </Label>
        <Label title={t('productIdReadonly')}>
          <Input
            {...register('productId', { valueAsNumber: true })}
            readOnly
            value={inventory.product.id}
          />
        </Label>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('selling') : t('submit')}
        </Button>
      </form>
    </SimpleDialog>
  )
}
