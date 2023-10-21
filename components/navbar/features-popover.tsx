import { Box, Button, Link, Popover, PopoverContent, PopoverTrigger, SimpleGrid, chakra, useColorModeValue } from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import { IoAddCircle, IoArrowDown, IoMailSharp, IoWarning } from "react-icons/io5";

function toHome() {
  router.push('/');
}
function toNewWidgetIssue() {
  router.push('https://github.com/terpnetwork/community-dashboard/issues/new');
}
function toBridge() {
  router.push('/w/bridge');
}
function toDelegate() {
  router.push('/w/delegate');
}
function toGov() {
  router.push('/w/gov');
}
const Section = (props: any) => {
  const ic = useColorModeValue("brand.600", "brand.50");
  const hbg = useColorModeValue("gray.50", "brand.400");
  const tcl = useColorModeValue("gray.900", "gray.50");
  const dcl = useColorModeValue("gray.500", "gray.50");
  return (
    <Link
      m={-3}
      p={3}
      display="flex"
      alignItems="start"
      onClick={props.href}
      rounded="lg"
      _hover={{
        bg: hbg,
      }}
    >
      <chakra.svg
        flexShrink={0}
        h={6}
        w={6}
        color={ic}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        {props.icon}
      </chakra.svg>
      <Box ml={4}>
        <chakra.p fontSize="sm" fontWeight="700" color={tcl}>
          {props.title}
        </chakra.p>
        <chakra.p mt={1} fontSize="sm" color={dcl}>
          {props.children}
        </chakra.p>
      </Box>
    </Link>
  );
};


const Features = (props: any) => {
  const hbg = useColorModeValue("gray.50", "brand.400");
  const hbgh = useColorModeValue("gray.100", "brand.500");
  const tcl = useColorModeValue("gray.900", "gray.50");
  return (
    <React.Fragment>
      <SimpleGrid
        columns={
          props.h
            ? {
              base: 1,
              md: 3,
              lg: 5,
            }
            : 1
        }
        pos="relative"
        gap={{
          base: 6,
          sm: 8,
        }}
        px={5}
        py={6}
        p={{
          sm: 8,
        }}
      >

        <Section
          href={toDelegate}
          title="Delegation Widget"
         
        >
         Choose a validator to delegate your TERP tokens to, and begin to earn more THIOL tokens. 
        </Section>

       
        <Section
          href={toGov}
          title="Governance Widget"
      
        >
View all active network governance proposals. Vote on proposals, if TERP tokens are delegated
        </Section>
        <Section
          href={toBridge}
          title="Cross-Chain Bridge Widget"
      
        >
Bridge tokens to and from Terp Network, powered by IBC.
        </Section>
        <Button onClick={toNewWidgetIssue}> <IoAddCircle/> &nbsp; Request a new widget </Button>

      </SimpleGrid>
    </React.Fragment>
  );
};


const FeaturesPopoverModal = () => {
  const bg = useColorModeValue("white", "gray.800");
  const cl = useColorModeValue("gray.800", "white");

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          bg={bg}
          color="gray.500"
          display="inline-flex"
          alignItems="center"
          fontSize="md"
          _hover={{
            color: cl,
          }}
          _focus={{
            boxShadow: "none",
          }}
          rightIcon={<IoArrowDown />}
        >
         Widgets
        </Button>
      </PopoverTrigger>

      <PopoverContent
        w="100vw"
        maxW="md"
        _focus={{
          boxShadow: "md",
        }}
      >
        <Features />
      </PopoverContent>
    </Popover>
  )
};
export default FeaturesPopoverModal;