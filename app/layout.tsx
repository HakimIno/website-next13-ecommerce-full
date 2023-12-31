import './globals.css'
import { Noto_Sans_Thai } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modal-provider'
import { ToasterProvider } from '@/providers/toast-provider'

const noto_sans_thai = Noto_Sans_Thai({ subsets: ['latin'] })

export const metadata = {
  title: 'Storepee',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <ClerkProvider>
      <html lang="en">
        <body className={noto_sans_thai.className}>
          <ToasterProvider />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
