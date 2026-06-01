'use client'

import { Toaster as SonnerToaster } from 'sonner'

export const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'rounded-lg border border-white bg-white/70 backdrop-blur shadow-lg shadow-black/10 text-sm',
          title: 'font-medium',
          description: 'text-gray-600',
          actionButton: 'rounded-md',
          closeButton: 'rounded-md',
        },
      }}
    />
  )
}
