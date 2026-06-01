import { getAuth } from '@foundation/network/src/auth/authOptions'
import { CreateWarehouse } from '@foundation/ui/src/components/organisms/CreateWarehouse'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function CreateWarehousePage() {
  const user = await getAuth()
  if (!user?.user) {
    const tc = await getTranslations('Common')
    return <Link href="/signin">{tc('signIn')}</Link>
  }
  return (
    <CreateWarehouse
      redirectUrl="/manufacturer/warehouses"
      warehouseRole={{ manufacturerId: user.user.uid }}
    />
  )
}
