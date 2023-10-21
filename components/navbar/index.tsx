import { Link, Box, ButtonGroup, Flex, Heading, SimpleGrid, Stack, chakra, useColorModeValue, useDisclosure, VStack, Button, HStack, IconButton, CloseButton, Popover, PopoverTrigger, PopoverContent, Switch, useColorMode } from "@chakra-ui/react";
import { useViewportScroll } from "framer-motion";
import React from "react";
import { FaBroadcastTower, FaConnectdevelop, FaDiscord, FaGithub, FaQq, FaQuestionCircle, FaQuran, FaTwitter, FaVoteYea } from "react-icons/fa";

import { ActionButton } from "./action-button";
import { ColorModeToggle } from "./color-mode-toggle";
import { CONSTANTS } from "../../config/defaults";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { FiCamera, FiHome } from "react-icons/fi";
import { IoArrowDown, IoMailOutline, IoNewspaperOutline, IoWalletOutline, IoWarningOutline } from "react-icons/io5";
import router from "next/router";
import FeaturesPopoverModal from "./features-popover";



function Navbar() {
  const { toggleColorMode: toggleMode } = useColorMode();
  const ref = React.useRef<HTMLDivElement>(null);
  const bg = useColorModeValue("white", "gray.800");
  const cl = useColorModeValue("gray.800", "white");
  const text = useColorModeValue("dark", "light");
  const [y, setY] = React.useState(0);
  const height = ref.current ? ref.current.getBoundingClientRect() : 0;
  const { scrollY } = useViewportScroll();
  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()));
  }, [scrollY]);
  const mobileNav = useDisclosure();

  function toHome() {
    router.push('/');
  }
  function toJudging() {
    router.push('/judging');
  }
  function toHeadStash() {
    router.push('/w/headstash');
  }
  function toEmergency() {
    router.push('/emergency');
  }
  function toPress() {
    window.location.href = 'https://daodao.zone/dao/juno1zdgyyzm34q22vmyz247evnzzls6kclun7v8l5ncjzlv7w2l4lvvqsevqe2/press';
  }
  


  const MobileNavContent = (
    <VStack
    pos="absolute"
    top={0}
    left={0}
    right={0}
    display={mobileNav.isOpen ? "flex" : "none"}
    flexDirection="column"
    p={2}
    pb={4}
    m={2}
    bg={bg}
    spacing={3}
    rounded="sm"
    shadow="sm"
    zIndex={10} // Set a higher z-index value for the mobile menu
  >
      <CloseButton
        aria-label="Close menu"
        justifySelf="self-start"
        onClick={mobileNav.onClose}
      />
        <Button w="full" onClick={toHome} variant="ghost" colorScheme="brand" leftIcon={<FaBroadcastTower />}>
       Home
      </Button>
      <Button onClick={toPress} w="full" variant="ghost" leftIcon={<IoNewspaperOutline />}>
        Blog 
      </Button>
  
      <Button onClick={toHeadStash} w="full" variant="ghost" leftIcon={<FaQuestionCircle />}>
      Headstash Dashboard
      </Button>
      {/* <Button onClick={toEmergency} w="full" variant="ghost" leftIcon={<IoWarningOutline />}>
      Emergency
      </Button> */}
    </VStack>
  );
  
  return (
    <nav className="navbar">
    <React.Fragment>
 <chakra.header
          ref={ref}
          shadow='md'
          transition="box-shadow 0.2s"
          bg={bg}

          borderTopColor="brand.400"
          w="full"
          overflowY="hidden"
        >
      <chakra.div h="4.5rem" mx="auto" maxW="1200px">
      <Flex
              w="full"
              h="full"
              px="6"
              alignItems="center"
              justifyContent="space-between"
            >
      <Flex align="flex-start">
        <Link href="/" >
        <HStack>
            {/* <Logo boxSize="6" mr="2" /> */}
            <Heading fontSize="xl" fontWeight="semibold">
              HeadStash UI 
            </Heading>
            </HStack>
        </Link>
      </Flex>
      <Flex>
                <HStack
                  spacing="5"
                  display={{
                    base: "none",
                    md: "flex",
                  }}
                >
                   <Link>
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
                  >
                    Blog 
                  </Button>
                 </Link>
                  <FeaturesPopoverModal/>
            
                </HStack>
              </Flex>
              <Flex justify="flex-end" align="center" color="gray.400">
                <HStack
                  spacing="5"
                  display={{
                    base: "none",
                    md: "flex",
                  }}
                >
       
                </HStack>

                 <Button
                  display={{
                    base: "flex",
                    md: "none",
                  }}
                  aria-label="Open menu"
                  fontSize="20px"
                  color="gray.800"
                  _dark={{
                    color: "inherit",
                  }}
                  variant="ghost"
                  onClick={mobileNav.onOpen}
                >menu &nbsp; <FaConnectdevelop /> </Button>
                        <ColorModeToggle />
        </Flex>
      </Flex>

    {MobileNavContent}
    </chakra.div>
    </chakra.header>
    </React.Fragment>
    </nav>
  );
}

export default Navbar;