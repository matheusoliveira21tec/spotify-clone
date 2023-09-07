import { Figtree } from 'next/font/google'

import getSongsByUserId from '@/actions/getSongsByUserId'
import Sidebar from '@/components/Sidebar'
import ToasterProvider from '@/provider/ToasterProvider'
import UserProvider from '@/provider/UserProvider'
import ModalProvider from '@/provider/ModalProvider'
import SupabaseProvider from '@/provider/SupabaseProvider'

import './globals.css'
import Player from '@/components/Player'

const font = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'Spotify Clone',
  description: 'Spotify Clone',
}

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userSongs = await getSongsByUserId();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSongs}>
              {children}
            </Sidebar>
            <Player/>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}