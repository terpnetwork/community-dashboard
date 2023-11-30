import { Box, Button, Flex, Link, Spinner, Text } from "@chakra-ui/react";
import { FC, useState, useEffect } from "react";

import ModalWrapper from "./ModalWrapper";
import SuccessIcon from "./TxSuccessIcon";
import FailedIcon from "./TxFailedIcon";
import ExternalLinkIcon from "./ExternalLinkIcon";
import truncateString from "@/components/badges/utils/helpers"
import { useStore } from '@/components/badges/utils/store'
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { copy } from "../utils/clipboard"
import React from "react";


function SpinnerWrapper() {
  return (
    <Spinner thickness="6px" speed="1s" emptyColor="transparent" color="brand.red" size="xl" />
  );
}

function TxHashText(txhash: string, url: string) {
  return (
    <Flex>
      <Text variant="dimmed" ml="auto" mr="3">
        Tx Hash
      </Text>
      <Link isExternal href={url} ml="3" mr="auto" my="auto" textUnderlineOffset="0.3rem">
        {truncateString(txhash, 6, 6)}
        <ExternalLinkIcon
          ml="2"
          style={{
            transform: "translateY(-2.4px)",
          }}
        />
      </Link>
    </Flex>
  );
}

function TxFailedText(error: any) {
  return (
    <Text mx="auto" px="12">
      {error}
    </Text>
  );
}

function CloseButton(showCloseBtn: boolean, onClick: () => void) {
  return showCloseBtn ? (
    <Button variant="outline" mt="12" onClick={onClick}>
      Close
    </Button>
  ) : null;
}

type Props = {
  getMsg: () => Promise<any>;
  isOpen: boolean;
  onClose: () => void;
};

const TxModal: FC<Props> = ({ getMsg, isOpen, onClose }) => {
  const store = useStore();
  const [showCloseBtn, setShowCloseBtn] = useState<boolean>(false);
  const [txStatusHeader, setTxStatusHeader] = useState<string>();
  const [txStatusIcon, setTxStatusIcon] = useState<JSX.Element>();
  const [txStatusDetail, setTxStatusDetail] = useState<JSX.Element>();

  useEffect(() => {
    setTxStatusHeader("Broadcasting Transaction...");
    setTxStatusIcon(SpinnerWrapper());
    setTxStatusDetail(<Text>Should be done in a few seconds 😉</Text>);
    setShowCloseBtn(false);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      getMsg()
        .then((msg) => {
          console.log("created execute msg:", msg);
          store
            .wasmClient!.execute(store.senderAddr!, store.networkConfig!.hub, msg, "auto", "", [])
            .then((result) => {
              setTxStatusHeader("Transaction Successful");
              setTxStatusDetail(
                TxHashText(
                  result.transactionHash,
                  store.networkConfig!.getExplorerUrl(result.transactionHash)
                )
              );
              setTxStatusIcon(<SuccessIcon h="80px" w="80px" />);
              setShowCloseBtn(true);
            })
            .catch((error) => {
              setTxStatusHeader("Transaction Failed");
              setTxStatusIcon(<FailedIcon h="80px" w="80px" />);
              setTxStatusDetail(TxFailedText(error));
              setShowCloseBtn(true);
            });
        })
        .catch((error) => {
          setTxStatusHeader("Transaction Failed");
          setTxStatusIcon(<FailedIcon h="80px" w="80px" />);
          setTxStatusDetail(TxFailedText(error));
          setShowCloseBtn(true);
        });
    }
  }, [isOpen]);

  return (
    <>
      {/* <ModalWrapper showHeader={false} isOpen={isOpen} onClose={onClose}>
        <Box w="100%" textAlign="center">
          <Text fontSize="xl" textStyle="minibutton" mt="10">
         
          </Text>
        
          <Box mt="3" mb="10">
        
         
          </Box>
        </Box>
      </ModalWrapper> */}
      <Dialog onOpenChange={isOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>
          <Button className="justify-center flex-1 gap-2 inline-flex items-center px-4 py-2 rounded-lg disabled:cursor-not-allowed   hover:bg-primary-700 claim-button">
            Claim
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sending Transaction</DialogTitle>
            <div className="flex items-center space-x-2">
              <DialogDescription>
                {txStatusHeader}
              </DialogDescription>
              {txStatusIcon}
            </div>
            {txStatusDetail}
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              {/* <Button type="button" variant="secondary">
                Close
              </Button> */}
              {CloseButton(showCloseBtn, onClose)}
            </DialogClose>

          </DialogFooter>
        </DialogContent>

      </Dialog>

    </>
  );
};

export default TxModal;
