import {Image} from '@interchain-ui/react'

export default function badgeNavbar() {

    return (
        <>
        <Image
        src="badges.gif"
        alt="logo"
        w="50px"
        h="60px"
        borderRadius="0"
        transition="0.1s all"
        _hover={{
          transform: "scale(1.1)",
        }}
      />
      </>
    )
}