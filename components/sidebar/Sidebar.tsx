/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// import BrandText from 'public/brand/brand-text.svg'

// import { BADGE_HUB_ADDRESS } from '../utils/constants'
// import { Conditional } from '../utils/conditional'

import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { SidebarLayout } from './SidebarLayout'
import { WalletLoader } from '../wallet/WalletLoader'
import { Timezone, setTimezone } from '../navbars/globalSettings'
import { setLogItemList, useLogStore } from './log'
import { footerLinks, socialsLinks } from '../utils/links'
import { useChain } from '@cosmos-kit/react'
const chainNames_1 = ["terpnetwork"];

export const Sidebar = () => {
  const router = useRouter()
  const wallet = useChain(chainNames_1[0])
  const logs = useLogStore()

  useEffect(() => {
    if (logs.itemList.length === 0) return
    console.log('Stringified log item list: ', JSON.stringify(logs.itemList))
    window.localStorage.setItem('logs', JSON.stringify(logs.itemList))
  }, [logs])

  useEffect(() => {
    console.log(window.localStorage.getItem('logs'))
    setLogItemList(JSON.parse(window.localStorage.getItem('logs') || '[]'))
    setTimezone(
      (window.localStorage.getItem('timezone') as Timezone)
        ? (window.localStorage.getItem('timezone') as Timezone)
        : 'UTC',
    )
  }, [])

  return (
    <SidebarLayout>
      {/* Stargaze brand as home button */}
<br/>
      {/* wallet button */}
      <WalletLoader />
      {/* main navigation routes */}

    
      <div className="absolute top-[20%] left-[5%] mt-2">
          <ul className="group p-2 w-full bg-transparent menu rounded-box">
            <li tabIndex={1}>
              <span
                className={clsx(
                  'z-40 text-xl font-bold group-hover:text-white bg-transparent rounded-lg small-caps',
                  'hover:bg-white/5 transition-colors',
                  router.asPath.includes('/w/headstash/') ? 'text-white' : 'text-gray',
                )}
              >
                <Link href="/w/headstash"> Headstash Airdrop </Link>
              </span>
              <ul className="z-50 p-2 rounded-box bg-base-200">
                <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                    router.asPath.includes('/w/headstash') ? 'text-white' : 'text-gray',
                  )}
                  tabIndex={-1}
                >
                  <Link href="/w/headstash/">Claim Headstash</Link>
                </li>

              </ul>
            </li>
          </ul>
      <ul className="group p-2 w-full bg-transparent menu rounded-box">
            <li tabIndex={1}>
              <span
                className={clsx(
                  'z-40 text-xl font-bold group-hover:text-white bg-transparent rounded-lg small-caps',
                  'hover:bg-white/5 transition-colors',
                  router.asPath.includes('/w/badges/') ? 'text-white' : 'text-gray',
                )}
              >
              Network
              </span>
              <ul className="z-50 p-2 rounded-box bg-base-200">
              <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                    router.asPath.includes('https://ping.pub/terp/staking') ? 'text-white' : 'text-gray',
                  )}
                  tabIndex={-1}
                >
                  <Link href="https://ping.pub/terp/staking">Stake TERP</Link>
                </li>
                <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                    router.asPath.includes('https://ping.pub/terp/staking') ? 'text-white' : 'text-gray',
                  )}
                  tabIndex={-1}
                >
                  <Link href="https://ibc.fun">Swap/Bridge</Link>
                </li>
                {/* <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                    router.asPath.includes('/w/fun') ? 'text-white' : 'text-gray',
                  )}
                  tabIndex={-1}
                >
                  <Link href="https://github.com/terpnetwork/core-cosmwasm">Smart Contracts</Link>
                </li> */}
                {/* <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                    router.asPath.includes('/w/utils') ? 'text-white' : 'text-gray',
                  )}
                  tabIndex={-1}
                >
                  <Link href="/w/utils/">Public Utilities</Link>
                </li> */}
              </ul>
            </li>
          </ul>

          <ul className="group p-2 w-full bg-transparent menu rounded-box">
            <li tabIndex={1}>
              <span
                className={clsx(
                  'z-40 text-xl font-bold group-hover:text-white bg-transparent rounded-lg small-caps',
                  'hover:bg-white/5 transition-colors',

                )}
              >
  Interchain Apps
              </span>
              <ul className="z-50 p-2 rounded-box bg-base-200">
              <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                  )}
                  tabIndex={-1}
                >
                  <Link href="https://daodao.zone/dao/juno1q2lwlsfawx5kyc8et26g9u3834g0qj0svrlpzn66nmzzmml66zastepvq4/proposals">DAO DAO</Link>
                </li>
                <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                  )}
                  tabIndex={-1}
                >
                  <Link href="https://stargaze.zone">Stargaze</Link>
                </li>
                <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                  )}
                  tabIndex={-1}
                >
                  <Link href="https://osmosis.zone">Osmosis</Link>
                </li>
                <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                  )}
                  tabIndex={-1}
                >
                  <Link href="https://shadeprotocol.io">Shade</Link>
                </li>
                <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                  )}
                  tabIndex={-1}
                >
                  <Link href="https://console.akash.network">Akash Console</Link>
                </li>
                <li
                  className={clsx(
                    'text-lg font-bold hover:text-white hover:bg-stargaze-80 rounded',
                  )}
                  tabIndex={-1}
                >
                  <Link href="https://omniflix.network">Omniflix</Link>
                </li>
              </ul>
            </li>
          </ul>

      </div>

      {/* <LogModal />
      <SettingsModal /> */}

      <div className="flex-grow" />
      <div className="flex-row w-full h-full">
        {/* <label
          className="absolute mb-8 w-[25%] text-lg font-bold text-white normal-case bg-zinc-500 hover:bg-zinc-600 border-none animate-none btn modal-button"
          htmlFor="my-modal-9"
        >
          <FaCog className="justify-center align-bottom" size={20} />
        </label> */}

        {/* <label
          className="ml-16 w-[65%] text-lg font-bold text-white normal-case bg-blue-500 hover:bg-blue-600 border-none animate-none btn modal-button"
          htmlFor="my-modal-8"
        >
          View Logs
        </label> */}
      </div>
      {/* Stargaze network status */}
      <div className="text-sm capitalize">Network: {wallet.chain.pretty_name}</div>

      {/* footer reference links */}
      <ul className="text-sm list-disc list-inside">
  {footerLinks.map(({ href, text }) => (
    <li key={href}>
      <Link className="hover:text-plumbus hover:underline" href={href ?? "#"}>
        {text}
      </Link>
    </li>
  ))}
</ul>

      {/* footer attribution */}
      <div className="text-xs text-white/50">
        Community Dashboard <br />
        Powered by{' '}
        <Link className="text-plumbus hover:underline" href="https://terp.network">
          Terp Network
        </Link>
      </div>

      {/* footer social links */}
      <div className="flex gap-x-6 items-center text-white/75">
        {socialsLinks.map(({ Icon, href, text }) => (
          <Link key={href} className="hover:text-plumbus" href={href}>
            <Icon aria-label={text} size={20} />
          </Link>
        ))}
      </div>
    </SidebarLayout>
  )
}
