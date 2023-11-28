import { useEffect, useState } from "react";
import { PageHeaderDescription, PageHeaderHeading } from "../utils/page-header";
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { useChain, useWallet } from "@cosmos-kit/react";




enum Page {
    Claim = 1,
    // Preview,
    // Submit,
  }

export default function Claim() {
    const { username, connect, disconnect, getOfflineSignerDirect, address, wallet, openView, status } = useChain(
        'terpnettestnet'
      );
        // which page to display
    const [page, setPage] = useState(Page.Claim);
    
    // inputs - badge id
    const [idStr, setIdStr] = useState("");
    const [idValid, setIdValid] = useState<boolean | null>(null);
    const [idInvalidReason, setIdInvalidReason] = useState("");
    
    // inputs - key 
    const [privkeyStr, setPrivkeyStr] = useState("");
    const [privkeyValid, setPrivkeyValid] = useState<boolean | null>(null);
    const [privkeyInvalidReason, setPrivkeyInvalidReason] = useState("");
  
      // inputs - owner
    const [owner, setOwner] = useState("");
    const [ownerValid, setOwnerValid] = useState<boolean | null>(null);
    const [ownerInvalidReason, setOwnerInvalidReason] = useState("");

     // whenever input id is changed, validate it
  useEffect(() => {
//     function setIdValidNull() {
//       setIdValid(null);
//       setIdInvalidReason("");
//       console.log("empty id");
//     }

    function setIdValidTrue() {
      setIdValid(true);
      setIdInvalidReason("");
      console.log(`id "${idStr}" is valid`);
    }

//     function setIdValidFalse(reason: string) {
//       setIdValid(false);
//       setIdInvalidReason(reason);
//       console.log(`invalid id "${idStr}": ${reason}`);
//     }

//     //--------------------
//     // stateless checks
//     //--------------------

//     if (idStr === "") {
//       return setIdValidNull();
//     }

//     const id = Number(idStr);

//     if (!Number.isInteger(id)) {
//       return setIdValidFalse("id must be an integer!");
//     }

//     if (id < 1) {
//       return setIdValidFalse("id cannot be zero!");
//     }

//     if (!!store.badgeCount && id > store.badgeCount) {
//       return setIdValidFalse(
//         `id cannot be greater than the current badge count! (count: ${store.badgeCount})`
//       );
//     }

//     //--------------------
//     // stateful checks
//     //--------------------

//     // skip if the query client isn't initialized
//     if (!store.wasmClient) {
//       return setIdValidNull();
//     }

//     store.getBadge(id).then((badge) => {
//       if (badge.rule !== "by_keys" && !("by_key" in badge.rule)) {
//         return setIdValidFalse("id is valid but this badge is not publicly mintable!");
//       }

//       if (badge.expiry && getTimestampInSeconds() > badge.expiry) {
//         return setIdValidFalse(
//           `id is valid but minting deadline has already elapsed! (deadline: ${formatTimestamp(
//             badge.expiry
//           )})`
//         );
//       }

//       if (badge.max_supply && badge.current_supply >= badge.max_supply) {
//         return setIdValidFalse(
//           `id is valid but max supply has already been reached! (max supply: ${badge.max_supply})`
//         );
//       }

      return setIdValidTrue();
//     });
  }, [idStr, ]); // <- TODO: add `store.wasmClient`



const claimPage = (
<>
<div className="max-w-screen-sm px-5 mx-auto mt-12 pb-20 badges-context"> 
<div className="badges-header"></div>
<div className="badges-toast"></div>
<PageHeaderHeading className="badges-title">Claim Your Badge</PageHeaderHeading>
<PageHeaderDescription className="badges-secondary-title">Enter the secret key to claim your badge.</PageHeaderDescription>
<PageHeaderDescription className="badges-secondary-title">Use Keplr or Metamask Snaps to create a wallet.</PageHeaderDescription>
<div className="flex flex-col gap-8 mt-8">
<div className=" flex gap-4 badges-id-and-key-container">
    <div className="w-32 badges-id">
        <div className=" mb-1 flex justify-between badges-id-label">Badge ID</div>
        <Input placeholder="710" id="badge-id" className="relative rounded-md shadow-sm badges-id-input"/>
    </div>
    <div className=" flex-auto badges-secret-key">
    <div className="mb-1 flex justify-between badges-secret-key-label">Badge Secret Key</div>
        <Input placeholder="0xEaSp0rts" className="badges-secret-key-input"/>
    </div>
    <div className=" flex flex-col justify-start wallet-address">
    </div>
</div>
<div className="relative rounded-md shadow-sm badges-claim-buttons-container">
<div className="mb-1 flex justify-between">
    <div className="block w-full ">Terp Wallet Address</div>
</div>
    <Input placeholder="terp1..." id="wallet-addr"/>
{status !== 'Connected' ? (
<div className="flex items-center mt-8 justify-center gap-6 badges-claim-buttons">
<Button onClick={() => connect()} className="justify-center flex-1 gap-2 inline-flex items-center px-4 py-2 rounded-lg disabled:cursor-not-allowed   hover:bg-primary-700 claim-button">Connect Wallet </Button>
</div>
):(
<div className="flex items-center mt-8 justify-center gap-6 badges-claim-buttons">
    <Button className="justify-center flex-1 gap-2 inline-flex items-center px-4 py-2 rounded-lg disabled:cursor-not-allowed   hover:bg-primary-700 claim-button">Claim Badge</Button>
    <Button onClick={() => disconnect()} variant="outline" className="inline-flex flex-non items-center px-4 py-2  rounded-lg gap-2 focus-visible:outline wallet-connect">Disconnect Wallet</Button>
</div>
)}
</div>

<div className="mt-8 flex flex-col gap-8 badge-data-content">
    <div className="flex justify-center items-center badge-image">

        <img alt="badge-image" loading="lazy" width="512" height="512" srcSet="https://bafybeiegatnkczuvu5dgujdkyx4oj3xi3mqe5vtnoh7ry3r2lqwfuycs6m.ipfs.nftstorage.link/blob"/>
    </div>
    <div className="flex flex-col gap-2 badge-metadata">
    <div className="metadata-title">
        <span className="text-lg font-semibold">Terp Network OG Badge</span>
    </div>
    <div className="metadata-description">
    <span className="text-zinc-400">Badges of OG Terp Network participants</span> 
    </div>
    <div className="metadata-supply">
    <span className="text-zinc-400">Current Supply</span>
    <span> 69</span>
    </div>
    <div className="metadata-total-supply">
    <span className="text-zinc-400">Max Supply</span>
    <span> 420</span>
    </div>
    <div className="metadata-deadline">
    <span className="text-zinc-400">Minting Deadline</span>
    <span> 7/10/2024</span>
    </div>

    </div>
</div>
</div>

</div>
</>
);

const pages = {
    [Page.Claim]: claimPage,
};

return <><div>{pages[page]}</div></>
}