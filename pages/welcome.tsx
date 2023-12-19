import { Icons } from "@/components/icons";
// import { buttonVariants } from "@/components/ui/button";
import { PageHeaderDescription, PageHeaderHeading } from "@/components/utils/page-header";
// import { cn } from "@/lib/utils";
// import Link from "next/link";



export default function Welcome() {
    return (
        <>
      <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
        <PageHeaderHeading className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
       Learn, Interact, Participate, Develop. All in 1 Dashboard.
        </PageHeaderHeading>


      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
            <h4 className="text-7xl font-bold">Learn</h4>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Terp Network Basics
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Interchain Wallet Tech
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Running Your Own Blockchain Node
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Creating A Token Based DAO
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Setup Your Own Sentry Node Array Via Akash
            </li>
          </ul>
            <p className="text-sm font-medium text-muted-foreground">

            </p>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
          </div>
        </div>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
            <h4 className="text-7xl font-bold">Interact</h4>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Headstsh Allocation
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Deploy A Smart Contract 
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Blockchain Explorer
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Query Terp Network 
            </li>
          <PageHeaderDescription className="text-xl font-bold sm:text-2xl">
            Learn
          </PageHeaderDescription>
          </ul>
            <p className="text-sm font-medium text-muted-foreground">

            </p>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
          </div>
        </div>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
            <h4 className="text-7xl font-bold">Participate</h4>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Governance Discussion Forum 
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Become A Testnet/Mainnet Validator
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Stake Tokens To A Validator
            </li>
          </ul>
            <p className="text-sm font-medium text-muted-foreground">

            </p>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
          </div>
        </div>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
            <h4 className="text-7xl font-bold">Develop</h4>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Create A Custom Chain Module
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Create A Custom Widget
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Find A Project
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Find A Developer
            </li>
          </ul>
            <p className="text-sm font-medium text-muted-foreground">

            </p>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[58rem] flex-col gap-4">
        {/* <p className="max-w-[85%] leading-normal text-muted-foreground sm:leading-7">
          Taxonomy is a demo app.{" "}
          <strong>You can test the upgrade and won&apos;t be charged.</strong>
        </p> */}
      </div>
    </section>
        </>
    )
}