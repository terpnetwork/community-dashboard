import '@/styles/globals.css'
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { SiteHeader } from "@/components/navbars/site-header"
import type { AppProps } from 'next/app'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: "Terp Network Contributors",
      url: "https://terp.network",
    },
  ],
  creator: "Terp Network Contributors",
    themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
    <SiteHeader />
    <Component {...pageProps} />
    </>
    ) 

}
