import { Factory, Store, Warehouse } from 'lucide-react'
import { HeroLink } from '../molecules/HeroLink'
import Link from 'next/link'
import { buttonVariants } from '../../util/variants'
import { getAuth } from '@foundation/network/src/auth/authOptions'
import { getTranslations } from 'next-intl/server'

export const HeroBanner = async () => {
  const session = await getAuth()
  const t = await getTranslations('Home')
  const tc = await getTranslations('Common')

  return (
    <div className="flex h-screen mt-32 ">
      <div>
        <h1 className="max-w-xl mb-4 text-5xl">
          {t('titleLead')} <span className="">{t('titleHighlight')}</span>
        </h1>
        <p className="max-w-md mb-8 text-xl">{t('subtitle')}</p>
        <div className="flex gap-4 my-4">
          <HeroLink Icon={Factory} url={'/manufacturer'}>
            {tc('manufacturer')}
          </HeroLink>
          <HeroLink Icon={Warehouse} url={'/distributor'}>
            {tc('distributor')}
          </HeroLink>
          <HeroLink Icon={Store} url={'/retailer'}>
            {tc('retailer')}
          </HeroLink>
        </div>
        {session?.user ? null : (
          <Link
            href="/register"
            className={buttonVariants({ variant: 'outline' })}
          >
            {tc('register')}
          </Link>
        )}
      </div>
    </div>
  )
}
