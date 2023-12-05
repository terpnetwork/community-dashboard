// import { Button } from "@/components/ui/button";
// import { withMetadata } from "@/components/badges/utils/layout"
// import { NextPage } from "next"
// import { useRouter } from "next/router";


// const BadgesStudio: NextPage = () => {
//     const router = useRouter();

//     function toCreate() {
//         router.push('/w/badges/create');
//         }
//     function toManage() {
//         router.push('/w/badges/manage');
//         }
//     function toClaim() {
//         router.push('/w/badges/claim');
//         }
//     function toMyCollection() {
//         router.push('/w/badges/mine');
//         }
        
//     return (
//         <section className="px-8 pt-4 pb-16 mx-auto space-y-8 max-w-4xl">
//           <div className="flex justify-center items-center py-8 max-w-xl">
//             {/* <Brand className="w-full text-plumbus" /> */}
//           </div>
//           <h1 className="font-heading text-4xl font-bold">Badges</h1>
//           <p className="text-xl">
//             Here you can create badges, execute badge related actions and query the results.
//             <br />
//           </p>
    
//           <br />
    

    
//           <div className="grid gap-8 md:grid-cols-2">
//             <Button className=" p-4 -m-4 hover:bg-gray-500/10 rounded flex relative flex-col space-y-4" onClick={toCreate} title="">
//             <h2 className="font-heading text-xl font-bold">Create a Badge</h2>
//               Select an asset, enter badge metadata and create a new badge.
//             </Button>
//             <Button className="p-4 -m-4 hover:bg-gray-500/10 rounded flex relative flex-col space-y-4" onClick={toClaim} >
//             <h2 className="font-heading text-xl font-bold flex-grow ">Claim a Badge</h2>
//               Claim your communities badge here.
//             </Button>
//             <Button className="p-4 m-4 hover:bg-gray-500/10 rounded flex relative flex-col space-y-4" onClick={toManage} title="">
//             <h2 className="font-heading text-xl font-bold flex-grow ">Badge Actions</h2>
//               Execute badge related actions.
//             </Button>
//             <Button className="p-4 m-4 hover:bg-gray-500/10 rounded flex relative flex-col space-y-4" onClick={toMyCollection} title="">
//             <h2 className="font-heading text-xl font-bold flex-grow text-white">View Your Badge Collection</h2>
//               View your badges.
//             </Button>
//           </div>
          
//         </section>
//     )
// }

// export default withMetadata(BadgesStudio, { center: false})