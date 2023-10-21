import Head from 'next/head';
import {
  Box,
  Divider,
  Grid,
  Heading,
  Text,
  Stack,
  Container,
  Link,
  Button,
  Flex,
  Icon,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import {
  Product,
  Dependency,
  WalletSection,
  StakingSection,
} from '../../components';
import { defaultChainName, dependencies, products } from '../../config';

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Delegate TERP</title>
        <meta name="Delegation Widget for Terp Network" content="Delegate TERP tokens to secure the network." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justifyContent="end" mb={4}>
      
      </Flex>
      <Box textAlign="center">
        <Heading
          as="h1"
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
          fontWeight="extrabold"
          mb={3}
        >
          Delegation Widget
        </Heading>
        <Heading
          as="h1"
          fontWeight="bold"
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
        >
          
        </Heading>
      </Box>
      <WalletSection isMultiChain={false} />
      <Divider />
      <StakingSection chainName={defaultChainName} />
   
      <Box mb={3}>
        <Divider />
      </Box>
      <Stack
        isInline={true}
        spacing={1}
        justifyContent="center"
        opacity={0.5}
        fontSize="sm"
      >
        <Text>Built with</Text>
        <Link
          href="https://cosmology.tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cosmology
        </Link>
      </Stack>
    </Container>
  );
}
