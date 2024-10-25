import { Inter } from 'next/font/google'

 

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'auto',
})

const inter = Montserrat({
  subsets: ['latin'],
  display: 'auto',
})
 
export default function RootLayout({children}) {
  return (
    <html lang="pt-br" className={montserrat.className}>
        <body>{children}</body>
    </html>
  )
}
