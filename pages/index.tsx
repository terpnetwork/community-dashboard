import Link from "next/link"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/utils/page-header"
import {DemoDatePicker} from "@/components/utils/to-headstash" 
import { Separator } from "@/components/ui/separator"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/ui/icons"
import { useChain } from "@cosmos-kit/react";
import { useIsClient } from "@/hooks";
import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button"
const chainNames_1 = ["terpnetwork"];

export default function Home() {
  const {chainWallet} = useChain(chainNames_1[0]);
  const isClient = useIsClient();

  useEffect(() => {
    const fn = async () => {
      await chainWallet?.connect();
    };
    fn();
  }, [chainWallet]);

  if (!isClient) return null;


  return (
    <main
      className="home-head">
       <PageHeader className="pb-8">
        <Link
          href="https://interchain.builders/c/terp"
          className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
        >
          🎉 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
          <span className="sm:hidden">Style, a new CLI and more.</span>
          <span className="hidden sm:inline">
            Introducing the Terp Network Community Dashboard, a collaborative, censorship-resistant ui.
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
        <div className="mb-32 grid text-center lg:max-w-5xl lg:grid-cols-4 lg:text-left">
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
            Find in-depth information about Terp Network API&apos;s.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Repo {' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Open up a new Github PR to add your widget to the dashboard.
          </p>
        </a>
      </div>
      
      <DemoDatePicker />
      </PageHeader>
    </main>
  )
}
