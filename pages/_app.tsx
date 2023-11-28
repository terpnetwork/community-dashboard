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
import { QueryClientProvider } from 'react-query'

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
import { queryClient } from '@/config/react-query';
import { ContractsProvider } from '@/components/badges/contexts/contracts';
import { Toaster } from 'react-hot-toast';
import { Layout } from '@/components/badges/components/layout';
import { getComponentMetadata } from '@/components/badges/utils/layout';
import StyledPointer from '@/components/utils/styled-pointer';
import { WagmiConfig, createConfig } from 'wagmi'
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
    { media: "(prefers-color-scheme: dark)", color: "black" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}


export default function App({ Component, pageProps }: AppProps) {

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
})


  return (

    <RootLayout>
      <QueryClientProvider client={queryClient}>
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
              }
            },
          }}
          disableIframe={false}
        >
          <SiteHeader />
          <WagmiConfig config={config}>
          <ContractsProvider>
            <Toaster position="top-right" />
            <Layout metadata={getComponentMetadata(Component)}>
              <Component {...pageProps} />
            </Layout>
          </ContractsProvider>
     </WagmiConfig>
        </ChainProvider>
      </QueryClientProvider>
    </RootLayout>

  )

}
