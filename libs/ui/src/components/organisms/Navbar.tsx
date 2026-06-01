import Link from 'next/link'
import { Brand } from '../atoms/brand'
import { SheetClose, SheetFooter, SheetHeader } from '../atoms/sheet'
import { DisplayUser } from '../molecules/DisplayUser'

import { Factory, Store, Warehouse } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { getTranslations } from 'next-intl/server'
import { LanguageSwitcher } from '../atoms/languageSwitcher'

export const Navbar = async () => {
  const t = await getTranslations('Common')

  return (
    <nav className="sticky top-0 w-full h-12 bg-white/40 backdrop-blur backdrop-filter">
      <div className="flex items-center justify-between">
        <Brand />
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Sidebar>
            <SheetHeader>
              <DisplayUser />
            </SheetHeader>

            <div className="flex flex-col gap-2 mt-4 mb-8">
              <Link href="/manufacturer">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4" /> {t('manufacturer')}
                </div>
              </Link>
              <Link href="/distributor">
                <div className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4" /> {t('distributor')}
                </div>
              </Link>
              <Link href="/retailer">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4" /> {t('retailer')}
                </div>
              </Link>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Link href="/api/auth/signout">{t('signOut')}</Link>
              </SheetClose>
            </SheetFooter>
          </Sidebar>
        </div>
      </div>
    </nav>
  )
}
