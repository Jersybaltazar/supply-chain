import Link from 'next/link'
import { Container } from '../atoms/container'
import { getTranslations } from 'next-intl/server'

export interface IFooterProps {}

export const Footer = async () => {
  const t = await getTranslations('Footer')
  return (
    <footer className="py-8 mt-8 text-xs bg-gray-200">
      <Container className="justify-between sm:flex">
        <Link
          target="_blank"
          href="https://portfolio-blond-nu.vercel.app/"
          rel="noreferrer"
        >
          <div className="font-black py-0.5"></div>
          <div>{t('portfolioProject')}</div>
          2026
        </Link>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          <div>{t('editorInChief')}</div>
          <div>Krowdforce</div>
          <div>Autospace</div>
          <div>Showtime</div>
          <div>{t('haveYouSeen')}</div>
          <div>{t('billboards')}</div>
          <div>{t('multiverse')}</div>
          <div>Epic</div>
          <div>Zillow</div>
          <div>{t('homeChefs')}</div>
          <div>Ikea</div>
          <div>{t('carbonCredits')}</div>
          <div>Sustainality</div>
          <div>{t('personalityVoting')}</div>
        </div>
      </Container>
    </footer>
  )
}
