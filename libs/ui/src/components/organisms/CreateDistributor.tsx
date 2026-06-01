'use client'
import { useEffect, useState } from 'react'
import { createDistributer } from '@foundation/network/src/actions/createDistributor'
import { useTranslations } from 'next-intl'

export const CreateDistributorAccount = ({ uid }: { uid: string }) => {
  const t = useTranslations('Account')
  const [isCreating, setIsCreating] = useState(true)

  useEffect(() => {
    const createAccount = async () => {
      try {
        await createDistributer({ uid })
      } finally {
        setIsCreating(false)
      }
    }

    if (uid) {
      createAccount()
    }
  }, [uid])

  if (isCreating) {
    return <div>{t('creatingDistributor')}</div>
  }

  return null
}
