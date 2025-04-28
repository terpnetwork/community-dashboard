interface Props {
  name: string
  value?: string
}

export default function MiniTile(props: Props) {
  return (
    <>
      <div className="rounded-xl bg-white border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 h-full flex items-center px-4 py-4">
        <div className="flex-1 text-center">
          <div className="text-neutral-500 dark:text-neutral-500 text-sm font-semibold mb-0.5">{props.name}</div>
        </div>
      </div>
    </>
  )
}
