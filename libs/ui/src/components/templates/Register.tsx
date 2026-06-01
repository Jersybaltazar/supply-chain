'use client'
import { useFormRegister } from '@foundation/forms/src/register'
import { RegisterWithCredentialsDocument } from '@foundation/network/src/queries/generated'
import { fetchGraphqlStatic } from '@foundation/network/src/fetch'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { AuthLayout } from '../organisms/AuthLayout'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export const Register = () => {
  const t = useTranslations('Auth')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormRegister()

  return (
    <AuthLayout title={t('registerTitle')}>
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(async (formData) => {
          const { data, error } = await fetchGraphqlStatic({
            document: RegisterWithCredentialsDocument,
            variables: {
              registerWithCredentialsInput: formData,
            },
          })
          if (error) {
            toast.error(t('registerFailed'))
            return
          }

          if (data) {
            toast.success(t('accountCreated'))
            signIn('credentials', {
              email: formData.email,
              password: formData.password,
              callbackUrl: '/',
            })
          }
        })}
      >
        <Label title={t('email')} error={errors.email?.message}>
          <Input
            className="block px-2 py-1 border rounded"
            placeholder={t('emailPlaceholder')}
            {...register('email')}
          />
        </Label>
        <Label title={t('password')} error={errors.password?.message}>
          <Input
            placeholder="******"
            className="block px-2 py-1 border rounded"
            type="password"
            {...register('password')}
          />
        </Label>
        <Label title={t('name')} error={errors.name?.message}>
          <Input
            placeholder={t('namePlaceholder')}
            className="block px-2 py-1 border rounded"
            {...register('name')}
          />
        </Label>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('creatingAccount') : t('submit')}
        </Button>
      </form>
      <div className="flex flex-col items-center gap-2 my-6">
        <div>
          {t('alreadyHaveAccount')}{' '}
          <Link href="/signIn" className="font-semibold">
            {t('signInLink')}
          </Link>
        </div>
        <div className="h-[1px] bg-black/20 w-36 my-2" />
        <button
          onClick={() => {
            signIn('google', { callbackUrl: '/' })
          }}
          className="text-lg hover:shadow-lg transition-shadow flex items-center justify-center w-8 h-8 border border-[#ea4335] rounded-full"
        >
          G
        </button>
      </div>
    </AuthLayout>
  )
}
