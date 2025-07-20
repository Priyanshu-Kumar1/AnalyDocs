// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AnalyDocs – Create intelligent documents with AI',
  description: 'Your AI-powered document builder',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://unpkg.com/feather-icons" strategy="lazyOnload"></Script>
      </head>
      <body className={inter.className}>
        {children}
        <Script id="feather-icons" dangerouslySetInnerHTML={{ __html: `feather.replace();` }} />
      </body>
    </html>
  )
}
