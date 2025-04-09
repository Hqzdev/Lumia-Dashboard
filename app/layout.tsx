import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lumia • Dashboard',
  description: 'Lumia is a platform for creating and managing your own AI agents.',
 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
