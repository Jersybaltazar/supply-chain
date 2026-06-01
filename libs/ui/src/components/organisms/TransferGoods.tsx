'use client'
import { useState } from 'react'

import { useFormTransferInventory } from '@foundation/forms/src/transferInventory'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'

import {
  TransferInventoryDocument,
  WarehouseDetailsFragment,
  namedOperations,
} from '@foundation/network/src/queries/generated'
import { Button } from '../atoms/button'
import { fetchGraphQLClient } from '@foundation/network/src/fetch/client'
import { SimpleDialog } from '../molecules/SimpleDialog'
import { revalidate } from '@foundation/network/src/actions/revalidate'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export const TransferGoods = ({
  warehouseId,
  inventory,
}: {
  warehouseId: number
  inventory: WarehouseDetailsFragment['inventories'][0]
}) => {
  const t = useTranslations('Inventory')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormTransferInventory()
  const [close, setClose] = useState(false)

  return (
    <SimpleDialog
      close={close}
      buttonText={
        <div className=" hover:underline underline-offset-4">
          {t('transfer')}
        </div>
      }
    >
      <div>{inventory.product.name}</div>
      <div>{inventory.quantity}</div>
      <form
        onSubmit={handleSubmit(
          async ({ productId, quantity, fromWarehouseId, toWarehouseId }) => {
            const { data, error } = await fetchGraphQLClient({
              document: TransferInventoryDocument,
              variables: {
                fromWarehouseId,
                productId,
                quantity,
                toWarehouseId,
              },
            })

            if (data?.transferInventory) {
              revalidate(namedOperations.Query.myWarehouses)
              toast.success(t('transferSuccess'))
              setClose(true)
              reset()
              return
            }
            if (error) {
              toast.error(t('transferFailed'))
            }
          },
        )}
      >
        <Label title={t('quantity')} error={errors.quantity?.message}>
          <Input {...register('quantity', { valueAsNumber: true })} />
        </Label>
        <Label title={t('warehouseIdReadonly')}>
          <Input
            {...register('fromWarehouseId', { valueAsNumber: true })}
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
        <Label
          title={t('targetWarehouseId')}
          error={errors.toWarehouseId?.message}
        >
          <Input {...register('toWarehouseId', { valueAsNumber: true })} />
        </Label>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('transferring') : t('submit')}
        </Button>
      </form>
    </SimpleDialog>
  )
}
