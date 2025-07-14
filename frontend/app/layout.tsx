// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AnalyDocs – Create intelligent documents with AI',
  description: 'Your AI-powered document builder',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/feather-icons"></script>
      </head>
      <body className={inter.className}>
        {children}
        <script dangerouslySetInnerHTML={{ __html: `feather.replace();` }} />
      </body>
    </html>
  )
}
