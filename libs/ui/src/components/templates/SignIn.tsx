'use client'
import { useFormSignIn } from '@foundation/forms/src/signin'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { AuthLayout } from '../organisms/AuthLayout'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export const SignIn = () => {
  const t = useTranslations('Auth')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormSignIn()
  return (
    <AuthLayout title={t('signInTitle')}>
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(async (data) => {
          const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
          })

          if (!result || result.error) {
            toast.error(t('wrongCredentials'))
            return
          }

          // Navegación completa al inicio para que la sesión quede fresca en
          // toda la app (navbar, menús, etc.) sin recargar manualmente.
          window.location.assign('/')
        })}
      >
        <Label title={t('email')} error={errors.email?.message}>
          <Input {...register('email')} placeholder={t('emailPlaceholder')} />
        </Label>
        <Label title={t('password')} error={errors.password?.message}>
          <Input
            type="password"
            {...register('password')}
            placeholder="******"
          />
        </Label>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('signingIn') : t('submit')}
        </Button>
      </form>
      <div className="flex flex-col items-center gap-2 my-6">
        <div>
          {t('newToApp')}{' '}
          <Link href="/register" className="font-semibold">
            {t('registerLink')}
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
