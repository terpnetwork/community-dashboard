'use client'

import { ArrowUpRight } from 'lucide-react'

import { Badge } from 'components/UI/badge'
import { Button } from 'components/UI/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/UI/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/UI/table'
import { HeadstashAllocation, initialSigDetails, SigDetails } from '@/types/Headstash'

export default function HeadstashAPITable({ amount, status }: { amount: HeadstashAllocation; status: SigDetails }) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Headstash Tokens</CardTitle>
          <CardDescription>All tokens eligible to redeem for this headstash</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          {/* <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link> */}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Headstash Token</TableHead>
              <TableHead className="hidden xl:table-column">Snip120u</TableHead>
              <TableHead className="hidden xl:table-column">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amount.headstash &&
              amount.headstash.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{item.contract}</div>
                    {/* <div className="hidden text-sm text-muted-foreground md:inline">
                                        {item.address}
                                    </div> */}
                  </TableCell>
                  {/* <TableCell className="hidden xl:table-column">{item[1]}</TableCell> */}
                  <TableCell className="">
                    {' '}
                    {status && status !== initialSigDetails ? (
                      <span style={{ color: 'green' }}>✓</span>
                    ) : (
                      <span style={{ color: 'red' }}>x</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{(item.amount / 1000000).toFixed(6)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
