'use client'
import { useEffect, useState } from 'react'
import { createManufacturer } from '@foundation/network/src/actions/createManufacturer'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const CreateManufacturerAccount = ({ uid }: { uid: string }) => {
  const t = useTranslations('Account')
  const [status, setStatus] = useState<'creating' | 'error'>('creating')

  useEffect(() => {
    if (!uid) return

    const createAccount = async () => {
      setStatus('creating')
      try {
        const result = await createManufacturer({ uid })
        if (!result?.ok) {
          setStatus('error')
          toast.error(t('createError'))
        }
        // En caso de éxito, el layout revalida y renderiza el panel.
      } catch (e) {
        setStatus('error')
        toast.error(t('createError'))
      }
    }

    createAccount()
  }, [uid])

  if (status === 'error') {
    return <div className="text-sm text-red-600">{t('createError')}</div>
  }

  return <div>{t('creatingManufacturer')}</div>
}
