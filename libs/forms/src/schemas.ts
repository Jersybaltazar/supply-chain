import { z } from 'zod'

export const formSchemaRegister = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  email: z.string().email('Ingresa un correo válido.'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
})

export const formSchemaSignIn = formSchemaRegister.pick({
  email: true,
  password: true,
})

export const formSchemaCreateItem = z.object({
  name: z.string().min(2),
})

export const addressSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
})

export const formSchemaCreateWarehouse = z.object({
  name: z.string().min(1, 'El nombre del almacén es obligatorio.'),
  description: z.string().optional(),
  manufacturerId: z.string().optional(),
  distributorId: z.string().optional(),
  retailerId: z.string().optional(),
  address: addressSchema,
})

export const formSchemaCreateProduct = z.object({
  name: z.string().min(1, 'El nombre del producto es obligatorio.'),
  description: z.string().optional(),
  image: z.any().optional(),
})

export const formSchemaUpsertInventory = z.object({
  warehouseId: z.number(),
  productId: z.number({ invalid_type_error: 'Selecciona un producto.' }),
  quantity: z
    .number({ invalid_type_error: 'Ingresa una cantidad.' })
    .int('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser mayor que cero.'),
})

export const formSchemaTransferInventory = z.object({
  productId: z.number(),
  quantity: z
    .number({ invalid_type_error: 'Ingresa una cantidad.' })
    .int('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser mayor que cero.'),
  fromWarehouseId: z.number(),
  toWarehouseId: z.number({
    invalid_type_error: 'Ingresa el ID del almacén destino.',
  }),
})

export const formSchemaSellInventory = z.object({
  productId: z.number(),
  quantity: z
    .number({ invalid_type_error: 'Ingresa una cantidad.' })
    .int('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser mayor que cero.'),
  warehouseId: z.number(),
})
