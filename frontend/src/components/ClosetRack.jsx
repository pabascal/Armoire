import { Box, useColorModeValue, useBreakpointValue, SimpleGrid } from '@chakra-ui/react';

//Horizontal closet rack bar that displays on Closet Page, where the clothes "hang" from.
//has to be dynamic in order to fit to the item cards on the page - changing as the diplay size
//changes or number of items changes.

const ClosetRack = ({ children, cardCount }) => {
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 }) || 1;
  const rackWidth = `${(cardCount / columns) * 100}%`;

  //Color definitions
  const rackColor = useColorModeValue('#D6C0B3', '#D6C0B399');

  return (
    <Box position="relative" width={rackWidth} mb={10}>
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="4px"
        bg={rackColor}
        borderRadius="full"
        boxShadow="lg"
        display={{ base: 'none', md: 'block' }}
      />
      <SimpleGrid
        columns={{
          base: 1,
          md: cardCount >= 2 ? 2 : 1,
          lg: cardCount >= 3 ? 3 : cardCount,
        }}
        spacing={10}
        width="100%">
        {children}
      </SimpleGrid>
    </Box>
  );
};
export default ClosetRack;
