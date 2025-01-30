import { Button, Text, HStack, useColorModeValue } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const FilterMenuButton = ({ label, count, ...props }) => {
  const textColor = useColorModeValue('black', '#f7fafaCC');
  const underlineColor = useColorModeValue('#D8D2C2', '#908382CC');

  return (
    <Button
      variant="unstyled"
      display="flex"
      alignItems="center"
      gap={1}
      position="relative"
      color={textColor}
      height="auto"
      padding={2}
      _after={{
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '1px',
        bg: underlineColor,
        transition: 'transform 0.1s',
        transform: 'scaleX(0)',
        transformOrigin: 'left'
      }}
      _hover={{
        _after: {
          transform: 'scaleX(1)'
        }
      }}
      {...props}
    >
      <HStack spacing={1}>
        <Text fontSize="md">{label}</Text>
        {count !== undefined && <Text fontSize="sm">({count})</Text>}
        <ChevronDownIcon boxSize={4} />
      </HStack>
    </Button>
  );
};

export default FilterMenuButton;