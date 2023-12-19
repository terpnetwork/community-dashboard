import Balance from "react-wrap-balancer"

import { cn } from "@/lib/utils"

function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "flex max-w-[980px] flex-col items-start gap-2 px-4 pt-8 md:pt-12",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

function PageHeaderHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "z-40  text-3xl font-bold  md:text-5xl rounded-lg rounded small-caps ",
        className
      )
      // clsx(
      //   'z-40 text-xl font-bold group-hover:text-white bg-transparent rounded-lg small-caps',
      //   'hover:bg-white/5 transition-colors',
      // )
    }
      {...props}
    />
  )
}

function PageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Balance
      className={cn(
        "max-w-[750px] text-lg text-muted-foreground sm:text-xl",
        className
      )}
      {...props}
      >
      </Balance>
  )
}

export { PageHeader, PageHeaderHeading, PageHeaderDescription }