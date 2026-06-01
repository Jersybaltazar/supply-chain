'use client'
import { useFormCreateProduct } from '@foundation/forms/src/createProduct'
import { Input } from '../atoms/input'
import { Textarea } from '../atoms/textArea'

import { ImagePreview } from '../molecules/ImagePreview'
import { Controller } from '@foundation/forms/src'

import { useImageUpload } from '@foundation/util/hooks'
import { revalidate } from '@foundation/network/src/actions/revalidate'
import {
  CreateProductDocument,
  namedOperations,
} from '@foundation/network/src/queries/generated'
import { useRouter } from 'next/navigation'
import { fetchGraphQLClient } from '@foundation/network/src/fetch/client'
import { toast } from 'sonner'
import { Title } from '../atoms/typography'
import { Button } from '../atoms/button'
import { Label } from '../atoms/label'
import { useTranslations } from 'next-intl'

export const CreateProduct = ({
  manufacturerId,
}: {
  manufacturerId: string
}) => {
  const t = useTranslations('Product')
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useFormCreateProduct()

  const { image } = watch()

  const [, uploadImages] = useImageUpload()
  const router = useRouter()

  return (
    <div>
      <Title className="mb-2 text-lg font-semibold">{t('create')}</Title>{' '}
      <form
        onSubmit={handleSubmit(async ({ name, description, image }) => {
          const images = await uploadImages(image)

          const { data, error } = await fetchGraphQLClient({
            document: CreateProductDocument,
            variables: {
              createProductInput: {
                image: images[0],
                name,
                description,
                manufacturerId,
              },
            },
          })
          if (data) {
            reset()
            revalidate(namedOperations.Query.myProducts)
            toast.success(t('created'))
            router.replace('/manufacturer/products')
          }
          if (error) {
            toast.error(t('createFailed'))
          }
        })}
        className="flex gap-2"
      >
        <div className="w-48 h-48">
          <ImagePreview src={image?.[0]} clearImage={() => resetField('image')}>
            <Controller
              control={control}
              name={`image`}
              render={({ field }) => (
                <Input
                  type="file"
                  accept="image/*"
                  multiple={false}
                  onChange={(e) => field.onChange(e?.target?.files)}
                />
              )}
            />
          </ImagePreview>
        </div>

        <div className="flex-grow space-y-2">
          <Label title="" error={errors.name?.message}>
            <Input {...register('name')} placeholder={t('namePlaceholder')} />
          </Label>
          <Textarea
            {...register('description')}
            placeholder={t('descPlaceholder')}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('creating') : t('create')}
          </Button>
        </div>
      </form>
    </div>
  )
}
