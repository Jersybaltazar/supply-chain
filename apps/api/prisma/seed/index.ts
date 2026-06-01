import { PrismaClient, AuthProviderType } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Cuenta demo: el mismo usuario actúa como Fabricante, Distribuidor y Minorista
// para poder mostrar el flujo completo de la cadena de suministro.
const DEMO_UID = 'seed-demo-supplychainx'
const DEMO_EMAIL = 'demo@supplychainx.pe'
const DEMO_PASSWORD = 'demo123'

// Limpia solo los datos de la cuenta demo, para no borrar lo que el usuario
// haya creado a mano. Se ejecuta en orden de dependencias.
const cleanDemoData = async () => {
  await prisma.transaction.deleteMany({
    where: { product: { manufacturerId: DEMO_UID } },
  })
  await prisma.inventory.deleteMany({
    where: { product: { manufacturerId: DEMO_UID } },
  })
  await prisma.location.deleteMany({
    where: {
      Warehouse: {
        OR: [
          { manufacturerId: DEMO_UID },
          { distributorId: DEMO_UID },
          { retailerId: DEMO_UID },
        ],
      },
    },
  })
  await prisma.warehouse.deleteMany({
    where: {
      OR: [
        { manufacturerId: DEMO_UID },
        { distributorId: DEMO_UID },
        { retailerId: DEMO_UID },
      ],
    },
  })
  await prisma.product.deleteMany({ where: { manufacturerId: DEMO_UID } })
  await prisma.manufacturer.deleteMany({ where: { uid: DEMO_UID } })
  await prisma.distributor.deleteMany({ where: { uid: DEMO_UID } })
  await prisma.retailer.deleteMany({ where: { uid: DEMO_UID } })
  await prisma.credentials.deleteMany({ where: { uid: DEMO_UID } })
  await prisma.authProvider.deleteMany({ where: { uid: DEMO_UID } })
  await prisma.user.deleteMany({ where: { uid: DEMO_UID } })
}

const createDemoUser = async () => {
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, bcrypt.genSaltSync())

  await prisma.user.create({
    data: {
      uid: DEMO_UID,
      name: 'Cuenta Demo',
      Credentials: { create: { email: DEMO_EMAIL, passwordHash } },
      AuthProvider: { create: { type: AuthProviderType.CREDENTIALS } },
      Manufacturer: { create: {} },
      Distributor: { create: {} },
      Retailer: { create: {} },
    },
  })
}

const createWarehouse = async (
  role: 'manufacturerId' | 'distributorId' | 'retailerId',
  name: string,
  description: string,
  location: { latitude: number; longitude: number; address: string },
) => {
  const roleData =
    role === 'manufacturerId'
      ? { manufacturerId: DEMO_UID }
      : role === 'distributorId'
        ? { distributorId: DEMO_UID }
        : { retailerId: DEMO_UID }

  const warehouse = await prisma.warehouse.create({
    data: { name, description, ...roleData },
  })
  await prisma.location.create({
    data: { ...location, warehouseId: warehouse.id },
  })
  return warehouse
}

const main = async () => {
  await cleanDemoData()
  await createDemoUser()

  // --- Productos (del fabricante) ---
  const cafe = await prisma.product.create({
    data: {
      name: 'Café orgánico',
      description: 'Café arábica de altura, tostado medio.',
      manufacturerId: DEMO_UID,
    },
  })
  const barra = await prisma.product.create({
    data: {
      name: 'Barra de cereal',
      description: 'Barra de quinua, kiwicha y miel.',
      manufacturerId: DEMO_UID,
    },
  })
  const platano = await prisma.product.create({
    data: {
      name: 'Plátano deshidratado',
      description: 'Snack de plátano de la selva central.',
      manufacturerId: DEMO_UID,
    },
  })

  // --- Almacenes (uno por rol, en distintas ciudades del Perú) ---
  const fabrica = await createWarehouse(
    'manufacturerId',
    'Fábrica Lima',
    'Planta de producción principal.',
    {
      latitude: -12.0464,
      longitude: -77.0428,
      address: 'Av. Industrial 100, Lima',
    },
  )
  const centroDistribucion = await createWarehouse(
    'distributorId',
    'Centro de Distribución Arequipa',
    'Hub regional sur.',
    {
      latitude: -16.409,
      longitude: -71.5375,
      address: 'Parque Industrial, Arequipa',
    },
  )
  const tienda = await createWarehouse(
    'retailerId',
    'Tienda Cusco',
    'Punto de venta al cliente final.',
    {
      latitude: -13.5319,
      longitude: -71.9675,
      address: 'Av. El Sol 200, Cusco',
    },
  )

  // --- Inventario (estado final tras los movimientos) ---
  const inventories: {
    productId: number
    warehouseId: number
    quantity: number
  }[] = [
    { productId: cafe.id, warehouseId: fabrica.id, quantity: 600 },
    { productId: cafe.id, warehouseId: centroDistribucion.id, quantity: 250 },
    { productId: cafe.id, warehouseId: tienda.id, quantity: 150 },
    { productId: barra.id, warehouseId: fabrica.id, quantity: 800 },
    { productId: barra.id, warehouseId: centroDistribucion.id, quantity: 100 },
    { productId: platano.id, warehouseId: fabrica.id, quantity: 500 },
  ]
  await prisma.inventory.createMany({ data: inventories })

  // --- Transacciones (recorrido fabricante -> distribuidor -> minorista) ---
  const transactions: {
    productId: number
    fromWarehouseId: number
    toWarehouseId: number
    quantity: number
  }[] = [
    {
      productId: cafe.id,
      fromWarehouseId: fabrica.id,
      toWarehouseId: centroDistribucion.id,
      quantity: 400,
    },
    {
      productId: cafe.id,
      fromWarehouseId: centroDistribucion.id,
      toWarehouseId: tienda.id,
      quantity: 150,
    },
    {
      productId: barra.id,
      fromWarehouseId: fabrica.id,
      toWarehouseId: centroDistribucion.id,
      quantity: 100,
    },
  ]
  await prisma.transaction.createMany({ data: transactions })

  console.log('Seed completado.')
  console.log(`Inicia sesion con: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
