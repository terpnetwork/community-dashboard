import { useEffect, useState } from "react";
import { PageHeaderDescription, PageHeaderHeading } from "../utils/page-header";
import { Input } from "@/components/ui/input"
import { FormHelperText, useDisclosure, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useChain, useWallet } from "@cosmos-kit/react";
import { BadgeResponse } from "@steak-enjoyers/badges.js/types/codegen/Hub.types";
import { useStore } from "./utils/store";
import { getTimestampInSeconds, formatTimestamp, bytesToHex, hexToBytes, sha256, } from '@/components/badges/utils/helpers'
import * as secp256k1 from "secp256k1";
import { bech32 } from "bech32";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label";

import TxModal from './components/TxModal'
import { Link } from "@interchain-ui/react";

enum Page {
    Claim = 1,
    Preview,
    Submit,
}
const fillerText = "Undefined";
const fillerImageUrl = "https://bafybeiegatnkczuvu5dgujdkyx4oj3xi3mqe5vtnoh7ry3r2lqwfuycs6m.ipfs.nftstorage.link/blob";

export default function Claim() {
    const store = useStore();
    const { username, connect, disconnect, getOfflineSignerDirect, address, wallet, openView, status } = useChain(
        'terpnettestnet'
    );
    // which page to display
    const [page, setPage] = useState(Page.Claim);
    const [txModalIsOpen, setTxModalIsOpen] = useState(false);

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

    // whether tx modal is open on the submit page
    const { isOpen: isTxModalOpen, onOpen: onTxModalOpen, onClose: onTxModalClose } = useDisclosure();

    // values on the preview page
    const [badge, setBadge] = useState<BadgeResponse>();

    const isButtonDisabled = !(!!idValid && !!privkeyValid);

    // whenever input id is changed, validate it
    useEffect(() => {
        function setIdValidNull() {
            setIdValid(null);
            setIdInvalidReason("");
            console.log("empty id");
        }

        function setIdValidTrue() {
            setIdValid(true);
            setIdInvalidReason("");
            console.log(`id "${idStr}" is valid`);
        }

        function setIdValidFalse(reason: string) {
            setIdValid(false);
            setIdInvalidReason(reason);
            console.log(`invalid id "${idStr}": ${reason}`);
        }

        //--------------------
        // stateless checks
        //--------------------

        if (idStr === "") {
            return setIdValidNull();
        }

        const id = Number(idStr);

        if (!Number.isInteger(id)) {
            return setIdValidFalse("id must be an integer!");
        }

        if (id < 1) {
            return setIdValidFalse("id cannot be zero!");
        }

        if (!!store.badgeCount && id > store.badgeCount) {
            return setIdValidFalse(
                `id cannot be greater than the current badge count! (count: ${store.badgeCount})`
            );
        }

        //--------------------
        // stateful checks
        //--------------------

        // skip if the query client isn't initialized
        if (!store.wasmClient) {
            return setIdValidNull();
        }

        store.getBadge(id).then((badge: BadgeResponse) => {
            if (badge.rule !== "by_keys" && !("by_key" in badge.rule)) {
                return setIdValidFalse("id is valid but this badge is not publicly mintable!");
            }

            if (badge.expiry && getTimestampInSeconds() > badge.expiry) {
                return setIdValidFalse(
                    `id is valid but minting deadline has already elapsed! (deadline: ${formatTimestamp(
                        badge.expiry
                    )})`
                );
            }

            if (badge.max_supply && badge.current_supply >= badge.max_supply) {
                return setIdValidFalse(
                    `id is valid but max supply has already been reached! (max supply: ${badge.max_supply})`
                );
            }

            return setIdValidTrue();
        });
    }, [idStr, store.wasmClient]);

    // whenever input key is changed, we need to validate it
    useEffect(() => {
        function setPrivkeyValidNull() {
            setPrivkeyValid(null);
            setPrivkeyInvalidReason("");
            console.log("empty key");
        }

        function setPrivkeyValidTrue() {
            setPrivkeyValid(true);
            setPrivkeyInvalidReason("");
            console.log(`key "${privkeyStr}" is valid`);
        }

        function setPrivkeyValidFalse(reason: string) {
            setPrivkeyValid(false);
            setPrivkeyInvalidReason(reason);
            console.log(`invalid key "${privkeyStr}": ${reason}`);
        }

        //--------------------
        // stateless checks
        //--------------------

        if (privkeyStr === "") {
            return setPrivkeyValidNull();
        }

        const bytes = Buffer.from(privkeyStr, "hex");

        // A string is a valid hex-encoded bytearray if it can be decoded to a Buffer, and the string
        // has exactly twice as many bytes as the number of the Buffer's bytes.
        if (bytes.length * 2 != privkeyStr.length) {
            return setPrivkeyValidFalse("not a valid hex string!");
        }

        try {
            if (!secp256k1.privateKeyVerify(bytes)) {
                return setPrivkeyValidFalse("not a valid secp256k1 private key!");
            }
        } catch (err) {
            return setPrivkeyValidFalse(`not a valid secp256k1 private key: ${err}`);
        }

        //--------------------
        // stateful checks
        //--------------------

        // skip if the query client isn't initialized
        if (!store.wasmClient) {
            return setPrivkeyValidNull();
        }

        // Now we know the key is a valid secp256k1 privkey, we need to check whether it is eligible for
        // claiming the badge.
        // Firstly, if we don't already have a valid badge id, it's impossible to determine to badge's
        // eligibility. Simply return null in this case.
        if (!!!idValid) {
            return setPrivkeyValidNull();
        }

        const pubkeyStr = bytesToHex(secp256k1.publicKeyCreate(hexToBytes(privkeyStr)));

        // this block of code is fucking atrocious, but "it just works"
        store.getBadge(Number(idStr)).then((badge) => {
            if (badge.rule === "by_keys") {
                store
                    .isKeyWhitelisted(Number(idStr), pubkeyStr)
                    .then((isWhitelisted) => {
                        if (isWhitelisted) {
                            return setPrivkeyValidTrue();
                        } else {
                            return setPrivkeyValidFalse(`this key is not eligible to claim badge #${idStr}`);
                        }
                    })
                    .catch((err) => {
                        return setPrivkeyValidFalse(
                            `failed to check this key's eligibility to claim badge #${idStr}: ${err}`
                        );
                    });
            } else if ("by_key" in badge.rule) {
                if (pubkeyStr === badge.rule["by_key"]) {
                    return setPrivkeyValidTrue();
                } else {
                    return setPrivkeyValidFalse(`this key is not eligible to claim badge #${idStr}`);
                }
            } else {
                return setPrivkeyValidFalse(`this key is not eligible to claim badge #${idStr}`);
            }
        });


    }, [privkeyStr, idStr, idValid, store.wasmClient]);

    // whenver input owner address is changed, we need to validate it
    useEffect(() => {
        function setOwnerValidNull() {
            setOwnerValid(null);
            setOwnerInvalidReason("");
            console.log("empty key");
        }

        function setOwnerValidTrue() {
            setOwnerValid(true);
            setOwnerInvalidReason("");
            console.log(`key "${privkeyStr}" is valid`);
        }

        function setOwnerValidFalse(reason: string) {
            setOwnerValid(false);
            setOwnerInvalidReason(reason);
            console.log(`invalid key "${privkeyStr}": ${reason}`);
        }

        //--------------------
        // stateless checks
        //--------------------

        if (owner === "") {
            return setOwnerValidNull();
        }

        try {
            const { prefix } = bech32.decode(owner);
            if (prefix !== store.networkConfig!.prefix) {
                return setOwnerValidFalse(
                    `address has incorrect prefix: expecting ${store.networkConfig!.prefix}, found ${prefix}`
                );
            }
        } catch (err) {
            return setOwnerValidFalse(`not a valid bech32 address: ${err}`);
        }

        //--------------------
        // stateful checks
        //--------------------

        // skip if the query client isn't initialized
        if (!store.wasmClient) {
            return setOwnerValidNull();
        }

        // Now we know the owner is a valid bech32 address, we need to check whether it is eligible for
        // claiming the badge.
        // Firstly, if we don't already have a valid badge id, it's impossible to determine to badge's
        // eligibility. Simply return null in this case.
        if (!!!idValid) {
            return setOwnerValidNull();
        }

        store
            .isOwnerEligible(Number(idStr), owner)
            .then((eligible) => {
                if (eligible) {
                    return setOwnerValidTrue();
                } else {
                    return setOwnerValidFalse(`this address is not eligible to claim badge #${idStr}`);
                }
            })
            .catch((err) => {
                return setOwnerValidFalse(
                    `failed to check this address' eligibility to claim badge #${idStr}: ${err}`
                );
            });
    }, [owner, idStr, idValid, store.wasmClient]);

    // if the id has been updated, we need to update the metadata displayed on the preview page
    // only update if the id is valid AND wasm client has been initialized
    useEffect(() => {
        if (!store.wasmClient) {
            console.log(`wasm client is uninitialized, setting badge to undefined`);
            return setBadge(undefined);
        }
        if (!idValid) {
            console.log(`invalid badge id "${idStr}", setting badge to undefined`);
            return setBadge(undefined);
        }
        store
            .getBadge(Number(idStr))
            .then((badge) => {
                console.log(`successfully fetched badge with id "${idStr}"! badge:`, badge);
                setBadge(badge);
            })
            .catch((err) => {
                console.log(`failed to fetch badge with id "${idStr}"! reason:`, err);
                setBadge(undefined);
            });
    }, [idStr, idValid, store.wasmClient]);

    // when the component is first mounted, we check the URL query params and auto-fill id and key
    useEffect(() => {
        const url = window.location.href;
        const split = url.split("?");
        const params = new URLSearchParams(split[1]);
        setIdStr(params.get("id") ?? "");
        setPrivkeyStr(params.get("key") ?? "");
    }, []);

    // if image url starts with `ipfs://...`, we grab the CID and return it with Larry's pinata gateway
    // otherwise, we return the url unmodified
    function parseImageUrl(url: string) {
        const ipfsPrefix = "ipfs://";
        if (url.startsWith(ipfsPrefix)) {
            const cid = url.slice(ipfsPrefix.length);
            return `https://ipfs-gw.stargaze-apis.com/ipfs/${cid}`;
        } else {
            return url;
        }
    }

    async function getMintMsg() {
        // Check if idStr is not provided or is an empty string
        if (!idStr) {
            throw new Error("idStr is required");
        }

        const privKey = Buffer.from(privkeyStr, "hex");
        const msg = `claim badge ${idStr} for user ${owner}`;
        const msgBytes = Buffer.from(msg, "utf8");
        const msgHashBytes = sha256(msgBytes);
        const { signature } = secp256k1.ecdsaSign(msgHashBytes, privKey);

        const badge = await store.getBadge(Number(idStr));

        if (badge.rule === "by_keys") {
            return {
                mint_by_keys: {
                    id: Number(idStr),
                    owner,
                    pubkey: Buffer.from(secp256k1.publicKeyCreate(privKey)).toString("hex"),
                    signature: Buffer.from(signature).toString("hex"),
                },
            };
        } else if ("by_key" in badge.rule) {
            return {
                mint_by_key: {
                    id: Number(idStr),
                    owner,
                    signature: Buffer.from(signature).toString("hex"),
                },
            };
        } else {
            return {
                mint_by_minter: {
                    id: Number(idStr),
                    owners: [owner],
                },
            };
        }
    }

    // when user closes the tx modal, we reset the page: revert back to the credentials page, and
    // empty the inputs
    function onClosingTxModal() {
        setPage(Page.Claim);
        setIdStr("");
        setIdValid(null);
        setPrivkeyStr("");
        setPrivkeyValid(null);
        setOwner("");
        setOwnerValid(null);
        onTxModalClose();
    }



    const claimPage = (
        <>
            <div className="max-w-screen-sm px-5 mx-auto mt-12 pb-20 badges-context">
                <div className="badges-header"></div>
                <div className="badges-toast"></div>
                <div className="badges-title">
                    <PageHeaderHeading>Claim Your Badge</PageHeaderHeading>
                </div>
                <div className="badges-secondary-title">
                    <PageHeaderDescription >Enter the secret key to claim your badge.</PageHeaderDescription>
                </div>
                <div className="badges-secondary-title">
                    <PageHeaderDescription >Use <Link className="font-bold text-plumbus hover:underline" href="https://keplr.app">Keplr</Link> or
                        <Link className="font-bold text-plumbus hover:underline" href="https://metamask.io/snaps/"> Metamask Snaps</Link> to create a wallet.</PageHeaderDescription>
                </div>
                <div className="flex flex-col gap-8 mt-8">
                    <div className=" flex gap-4 badges-id-and-key-container">
                        <div className="w-32 badges-id">
                            <FormControl mb="4" isInvalid={idValid !== null && !idValid}>
                                <div className=" mb-1 flex justify-between badges-id-label">Badge ID</div>
                                <Input className="relative rounded-md shadow-sm badges-id-input"
                                    value={idStr}
                                    placeholder="710"
                                    onChange={(event) => {
                                        setIdStr(event.target.value);
                                    }}
                                />
                                {idValid !== null ? (
                                    idValid ? (
                                        <FormHelperText>✅ valid id</FormHelperText>
                                    ) : (
                                        <FormErrorMessage>{idInvalidReason}</FormErrorMessage>
                                    )
                                ) : null}
                            </FormControl>
                        </div>
                        <div className=" flex-auto badges-secret-key">
                            <div className="mb-1 flex justify-between badges-secret-key-label">Badge Secret Key</div>
                            <FormControl mb="4" isInvalid={privkeyValid !== null && !privkeyValid}>
                                <Input placeholder="0xEaSp0rts" className="badges-secret-key-input"
                                    value={privkeyStr}
                                    onChange={(event) => {
                                        setPrivkeyStr(event.target.value);
                                    }} />
                                {privkeyValid !== null ? (
                                    privkeyValid ? (
                                        <FormHelperText>✅ valid key</FormHelperText>
                                    ) : (
                                        <FormErrorMessage>{privkeyInvalidReason}</FormErrorMessage>
                                    )
                                ) : null}
                            </FormControl>
                        </div>
                        <div className=" flex flex-col justify-start wallet-address">
                        </div>
                    </div>
                    <div className="relative rounded-md shadow-sm badges-claim-buttons-container">
                        <div className="mb-1 flex justify-between">
                            <div className="block w-full ">Terp Network Wallet Address</div>
                        </div>
                        <FormControl mb="4" isInvalid={ownerValid !== null && !ownerValid}>
                            <Input
                                placeholder="terp1..."
                                id="wallet-addr"
                                defaultValue={status === 'Connected' ? address : ''}
                                onChange={(event) => {
                                    setOwner(event.target.value);
                                }}
                            />
                            {ownerValid !== null ? (
                                ownerValid ? (
                                    <FormHelperText>✅ valid address</FormHelperText>
                                ) : (
                                    <FormErrorMessage>{ownerInvalidReason}</FormErrorMessage>
                                )
                            ) : (
                                <FormHelperText>
                                    Let's check if your account can claim an existing badge!
                                </FormHelperText>
                            )}
                        </FormControl>
                        {status !== 'Connected' ? (
                            <div className="flex items-center mt-8 justify-center gap-6 badges-claim-buttons">
                                <Button onClick={() => connect()} className="justify-center flex-1 gap-2 inline-flex items-center px-4 py-2 rounded-lg disabled:cursor-not-allowed   hover:bg-primary-700 claim-button">
                                    Connect Wallet
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center mt-8 justify-center gap-6 badges-claim-buttons ">

                                {isButtonDisabled ? (
                                    <TxModal isOpen={isTxModalOpen} onClose={onClosingTxModal} getMsg={getMintMsg} />

                                ) : (
                                    <></>
                                )}
                                <Button onClick={() => disconnect()} variant="outline" className="inline-flex flex-non items-center px-4 py-2  rounded-lg gap-2 focus-visible:outline wallet-connect">
                                    Disconnect Wallet
                                </Button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );


    const pages = {
        [Page.Claim]: claimPage,
    };

    return <>
        <div>
            {pages[page]}
            <div className="mt-8 flex flex-col gap-8 badge-data-content">
                <div className="flex justify-center items-center badge-image">
                    <img alt="badge-image" loading="lazy" width="512" height="512" src={parseImageUrl(badge?.metadata.image ?? fillerImageUrl)} />
                </div>
                <div className="flex flex-col gap-2 badge-metadata">
                    <div className="metadata-title">
                        <span className="text-lg font-semibold">
                            {badge?.metadata.name ?? fillerText}
                        </span>
                    </div>
                    <div className="metadata-description">
                        <span className="text-zinc-400">
                            {badge?.metadata.description ?? fillerText}
                        </span>
                    </div>
                    <div className="metadata-supply">
                        <span className="text-zinc-400">Current Supply</span>
                        <span> {badge?.current_supply ?? fillerText}</span>
                    </div>
                    <div className="metadata-total-supply">
                        <span className="text-zinc-400">Max Supply</span>
                        <span> {badge ? badge.max_supply ?? "No max supply" : fillerText} </span>
                    </div>
                    <div className="metadata-deadline">
                        <span className="text-zinc-400">Minting Deadline</span>
                        <span>   {badge ? (badge.expiry ? formatTimestamp(badge.expiry) : "No deadline") : fillerText} </span>
                    </div>
                </div>
            </div>
        </div>
    </>
}