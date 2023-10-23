import Image from "next/image"
import Link from "next/link"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/utils/page-header"
import { Separator } from "@/components/ui/separator"
import { ArrowRightIcon, PaperPlaneIcon, ResetIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/ui/icons"
import { useChain, useWallet } from "@cosmos-kit/react";
import { useIsClient } from "@/hooks";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge"

import { ChainWalletCard } from "@/components/wallet/chain-wallet-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@interchain-ui/react"
import { buttonVariants } from "@/components/ui/button"

const chainNames_1 = ["terpnetwork"];
const chainNames_2: string[] = [];

export default function Home() {
  const { username, connect, disconnect, wallet, openView } = useChain(
    chainNames_1[0]
  );
  const { status: globalStatus, mainWallet } = useWallet(); // status here is the global wallet status for all activated chains (chain is activated when call useChain)
  const isClient = useIsClient();

  useEffect(() => {
    const fn = async () => {
      await mainWallet?.connect();
    };
    fn();
  }, []);

  if (!isClient) return null;

  const getGlobalbutton = () => {
    if (globalStatus === "Connecting") {
      return (
        <Button onClick={() => connect()}>
          <PaperPlaneIcon className="mr-2 h-4 w-4" />
          {`Connecting ${wallet?.prettyName}`}
        </Button>
      );
    }
    if (globalStatus === "Connected") {
      return (
        <>
          <Button variant="outlined" size="sm" onClick={() => openView()}>
            <div className="flex justify-center items-center space-x-2">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500 leading-4 mb-2" />
              <span>Connected to: {wallet?.prettyName}</span>
            </div>
          </Button>

          <Badge className="flex" variant="outline">
            Account name: {username}
          </Badge>

          <Button
            variant="outlined"
            onClick={async () => {
              await disconnect();
              // setGlobalStatus(WalletStatus.Disconnected);
            }}
          >
            <ResetIcon className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </>
      );
    }

    return (
    <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:">
     
      <Button
     onClick={() => connect()}
   
     >Connect Wallet</Button>
     </div>
     );
  };


  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 `}
    >
       <PageHeader className="pb-8">
        <Link
          href="https://interchain.builders/c/terp"
          className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
        >
          🎉 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
          <span className="sm:hidden">Style, a new CLI and more.</span>
          <span className="hidden sm:inline">
            Introducing the Terp Network Community Dashboard, a collaborative, sensorship-resistant ui.
          </span>
          <ArrowRightIcon className="ml-1 h-4 w-4" />
        </Link>
        <PageHeaderHeading>Build the tools you need.</PageHeaderHeading>
        <PageHeaderDescription>
        Develop opportunities, empower connections, and unlock endless possibilities together.
        </PageHeaderDescription>
        <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
          <Link href="/docs" className={cn(buttonVariants())}>
            Get Started
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.github}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Link>

          
        </div>
      </PageHeader>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
       <Card className="min-w-[350px] max-w-[800px] mt-20 mx-auto p-10">
      <CardHeader>
        <CardTitle>
          <p className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Connect with a Cosmos Compatible Wallet
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex justify-start space-x-5"></div>
        {getGlobalbutton()}
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
     
        </h2>
        {chainNames_1.map((chainName) => (
          <ChainWalletCard
            key={chainName}
            type="address-in-modal"
            chainName={chainName}
          />
        ))}
       
        {chainNames_2.map((chainName) => (
          <ChainWalletCard
            key={chainName}
            type="address-on-page"
            chainName={chainName}
          />
        ))}
      </CardContent>
    </Card>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Terp Network API's.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about building tools using Nextjs, Cosmjs, CosmWasm, & IBC.
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
           Reverse engineer existing widgets, & customize them to your needs!
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Open up a new Github PR to add your widget to the dashboard.
          </p>
        </a>
      </div>
    </main>
  )
}
