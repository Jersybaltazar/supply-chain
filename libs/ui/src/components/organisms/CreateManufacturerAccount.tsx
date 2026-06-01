'use client'
import { useEffect, useState } from 'react'
import { createManufacturer } from '@foundation/network/src/actions/createManufacturer'
import { useTranslations } from 'next-intl'

export const CreateManufacturerAccount = ({ uid }: { uid: string }) => {
  const t = useTranslations('Account')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const createAccount = async () => {
      try {
        setIsCreating(true)
        await new Promise((resolve) => setTimeout(resolve, 4000))
        await createManufacturer({ uid })
      } finally {
        setIsCreating(false)
      }
    }

    if (uid) {
      createAccount()
    }
  }, [uid])

  if (isCreating) {
    return <div>{t('creatingManufacturer')}</div>
  }

  return null
}
