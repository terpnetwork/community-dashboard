import { Card } from "@/components/ui/card"
import {Button} from "@/components/ui/button"

import router from "next/router";

function toHeadstash() {
    router.push('/w/headstash');
}
// function toBadges() {
//   router.push('/w/badges');
// }


export function DemoDatePicker() {
    // const router = useRouter()
  return (
    <>
    <Card>
        <Button onClick={toHeadstash} size="lg"
        className=" pt-6rounded-lg border border-transparent transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
   
        <div  className="space-y-2 text-3xl font-bold ">        
           NEW: Claim Headstash Allocation  -{">"}
        </div>
    
      </Button>
    </Card>
    <br/>
    {/* <Card>
        <Button onClick={toBadges} size="lg"
        className=" pt-6rounded-lg border border-transparent transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
   
        <div  className="space-y-2 text-3xl font-bold ">        
           NEW:  Badges on Terp Network  -{">"}
        </div>
    
      </Button>
    </Card> */}
    </>
  )
}