import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import router, { useRouter } from "next/router";

function toHeadstash() {
    router.push('/w/headstash');
}

export function DemoDatePicker() {
    const router = useRouter()
  return (
    <Card>
        <Button onClick={toHeadstash} size="lg"
        className=" pt-6rounded-lg border border-transparent transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
   
        <div  className="space-y-2 text-3xl font-bold ">        
           NEW: Claim Headstash Allocation
        </div>
    
      </Button>
    </Card>
  )
}