import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import React from 'react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900',]
})

export const metadata: Metadata = {
  title: 'FN API',
  description: 'FN\'s API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <body className={poppins.className}>{children}</body>
    </html>
  )
}
