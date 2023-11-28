


import { PageHeader } from '@/components/utils/page-header'
import { Link } from '@interchain-ui/react'

interface ContractPageHeaderProps {
  title: string
  description?: string
  link: string
}

export const ContractPageHeader = ({ title, description, link }: ContractPageHeaderProps) => {
  return (
    <PageHeader title={title}>
      {description} Learn more in the{' '}
      <Link className="font-bold text-plumbus hover:underline" href={link}>
        documentation.
      </Link>
      
    </PageHeader>
  )
}
