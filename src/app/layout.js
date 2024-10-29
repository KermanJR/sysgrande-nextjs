import  { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})


export default function RootLayout({children}) {
  return (
    <html lang="pt-br" className={montserrat.className}>
        <body>{children}</body>
    </html>
  )
}
