import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toUsdString, trackMixPanelEvent } from 'utils/commons'
import { Link } from 'react-router-dom'

interface Props {
  price?: number
}

export default function ClaimHeadstash(props: Props) {
  return (
    <div className="rounded-xl bg-white border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 h-full flex items-center px-4 py-2">
      <div className="flex-1">
        <div className="text-center inline-block">
          {/* <div className="text-neutral-400 dark:text-neutral-500 text-sm font-semibold mb-0.5">Headstash Guides!</div> */}
          <div className="text-xl"></div>
        </div>
      </div>
      <Link
        to="/headstash"
        className="w-full md:w-auto md:px-4 inline-block bg-cyan-500 dark:bg-cyan-500/20 text-white dark:text-cyan-200 dark:hover:text-cyan-100 hover:bg-cyan-400 dark:hover:bg-cyan-500/50 text-center transition-colors py-2.5 rounded-xl font-semibold text-sm"
        onClick={() => {}}
      >
        View Headstash Guides
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs ml-2" />
      </Link>
      <div className="flex-1 text-right"></div>
    </div>
  )
}
