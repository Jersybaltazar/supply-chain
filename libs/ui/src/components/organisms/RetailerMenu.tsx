import { RetailerQuery } from '@foundation/network/src/queries/generated'
import Image from 'next/image'
import { Link } from '../molecules/CustomLink'
import { Title2 } from '../atoms/typography'
import { Sheet, SheetContent, SheetTrigger } from '../atoms/sheet'
import { Button } from '../atoms/button'
import { Menu } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const RetailerMenu = async ({ retailer }: RetailerQuery) => {
  const t = await getTranslations('Common')
  const tm = await getTranslations('Menu')
  return (
    <div className="flex flex-col w-full max-w-xs gap-2">
      <Image
        src={retailer?.user.image || '/no-image.jpeg'}
        alt=""
        width={300}
        height={300}
        className="border-white rounded-lg shadow-lg"
      />
      <div className="mb-2">
        <Title2 className="text-xl font-semibold">{retailer?.user.name}</Title2>
      </div>

      <div className="flex flex-col gap-2">
        <Link href="/retailer">{t('panel')}</Link>
        <Link href="/retailer/warehouses">{tm('manageWarehouses')}</Link>
        {retailer?.warehouses.map((warehouse) => (
          <Link href={`/retailer/warehouses/${warehouse.id}`} className="pl-4">
            {warehouse.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function RetailerSidebar({ retailer }: RetailerQuery) {
  return (
    <div className="sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <RetailerMenu retailer={retailer} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
