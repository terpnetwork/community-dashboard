import { ImGithub, ImTwitter } from 'react-icons/im'
import { SiDiscord } from 'react-icons/si'

import { BLOCK_EXPLORER_URL, NETWORK } from '../../utils/constants'

export const links = {
  // main links
  Discord: `https://discord.gg/Ysax2SqXyc`,
  Docs: `https://docs.terp.network/`,
  GitHub: `https://github.com/terpnetwork/community-dashboard`,
  // Survey: `https://stargaze-zone.typeform.com/studiosurvey`,
  // Telegram: `https://t.me/joinchat/ZQ95YmIn3AI0ODFh`,
  Twitter: `https://twitter.com/terpnetofficial`,
  Explorer: BLOCK_EXPLORER_URL,
  Documentation: 'https://docs.stargaze.zone/guides/stargaze-studio',
  Switch: `${NETWORK === 'testnet' ? 'https://test.dash.terp.network' : 'https://dash.terp.network'}`,
}

export const footerLinks = [
  // { text: `Switch to ${NETWORK === 'mainnet' ? 'Testnet' : 'Mainnet'}`, href: links.Switch },
  { text: 'Block Explorer', href: links.Explorer },
  { text: 'Documentation', href: links.Docs },
  { text: 'Submit an issue', href: `${links.GitHub}/issues/new` },
  // { text: 'Studio Survey', href: links.Survey },
]

export const socialsLinks = [
  { text: 'Discord', href: links.Discord, Icon: SiDiscord },
  { text: 'GitHub', href: links.GitHub, Icon: ImGithub },
  // { text: 'Telegram', href: links.Telegram, Icon: SiTelegram },
  { text: 'Twitter', href: links.Twitter, Icon: ImTwitter },
]
