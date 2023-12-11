// style imports 
import '@/styles/globals.css'
import "@interchain-ui/react/styles";

// next & react imports 
import { Metadata } from "next"
import type { AppProps } from 'next/app'
import React from "react";

// application component imports 
import { SiteHeader } from "@/components/navbars/site-header"
import { RootLayout } from '@/components/layout'
import { siteConfig } from "@/config/site"
import { QueryClientProvider } from 'react-query'

// cosmos chain & wallet imports 
import { assets, chains as cosmosChains } from "chain-registry";
import { publicProvider } from 'wagmi/providers/public'
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as snapWallet } from "@cosmos-kit/leap-metamask-cosmos-snap";
import { wallets as ledgerWallets } from "@cosmos-kit/ledger";
import { queryClient } from '@/config/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from '@/components/layout';
import { getComponentMetadata } from '@/components/utils/layout';
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

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
      url: "https://dash.terp.network",
    },
  ],
  creator: "Terp Network Contributors",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "black" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

// wagmi config  
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <QueryClientProvider client={queryClient}>
        <ChainProvider
          chains={[...cosmosChains]}
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
            <Toaster position="top-right" />
            <Layout metadata={getComponentMetadata(Component)}>
              <Component {...pageProps} />
            </Layout>
     </WagmiConfig>
        </ChainProvider>
      </QueryClientProvider>
    </RootLayout>

  )

}
