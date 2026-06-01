'use client'
import { useEffect, useState } from 'react'
import { createRetailer } from '@foundation/network/src/actions/createRetailer'
import { useTranslations } from 'next-intl'

export const CreateRetailerAccount = ({ uid }: { uid: string }) => {
  const t = useTranslations('Account')
  const [isCreating, setIsCreating] = useState(true)

  useEffect(() => {
    const createAccount = async () => {
      try {
        await createRetailer({ uid })
      } finally {
        setIsCreating(false)
      }
    }

    if (uid) {
      createAccount()
    }
  }, [uid])

  if (isCreating) {
    return <div>{t('creatingRetailer')}</div>
  }

  return null
}
