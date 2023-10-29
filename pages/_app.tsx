// style imports 
import '@/styles/globals.css'
import "@interchain-ui/react/styles";

// next & react imports 
import { Metadata } from "next"
import type { AppProps } from 'next/app' 
import React, { useMemo } from "react";

// application component imports 
import { SiteHeader } from "@/components/navbars/site-header"
import { RootLayout } from '@/components/layout'
import { siteConfig } from "@/config/site"

// cosmos chain & wallet imports 
import { assets, chains } from "chain-registry";
import { Chain } from "@chain-registry/types";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as snapWallet } from "@cosmos-kit/leap-metamask-cosmos-snap";
import { wallets as ledgerWallets } from "@cosmos-kit/ledger";
// import { makeWeb3AuthWallets } from "@cosmos-kit/web3auth";

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

     <RootLayout>
         <ChainProvider
          chains={[...chains]}
          assetLists={[...assets]}
          wallets={[
            ...leapWallets,
            ...snapWallet,
            ...keplrWallets,
            ...ledgerWallets,
            // ...web3AuthWallets,
     
          ]}
          throwErrors={false}
          subscribeConnectEvents={false}
          defaultNameService={"stargaze"}
          walletConnectOptions={{
            signClient: {
              projectId: "a8510432ebb71e6948cfd6cde54b70f7",
              relayUrl: "wss://relay.walletconnect.org",
              metadata: {
                name: "CosmosKit Example",
                description: "CosmosKit test dapp",
                url: "https://test.cosmoskit.com/",
                icons: [
                  "https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/packages/docs/public/favicon-96x96.png",
                ],
              },
            },
          }}
          logLevel={"DEBUG"}
        endpointOptions={{
          isLazy: true,
          endpoints: {
            cosmoshub: {
              isLazy: false,
              rpc: [
                {
                  isLazy: true,
                  url: "https://rpc.cosmos.directory/cosmoshub",
                  headers: {},
                },
              ],
            },
            terra2: {
              rpc: ["https://terra-rpc.lavenderfive.com/"],
              rest: ["https://phoenix-lcd.terra.dev/"],
            },
            terra2testnet: {
              rpc: ["https://terra-testnet-rpc.polkachu.com/"],
              rest: ["https://pisco-lcd.terra.dev/"],
            },
          },
        }}
        disableIframe={false}
          >
    <SiteHeader />
    <Component {...pageProps} />
    </ChainProvider>
    </RootLayout>

    ) 

}
