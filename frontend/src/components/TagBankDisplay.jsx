import {
  Box,
  VStack,
  Text,
  HStack,
  Tag,
  TagLabel,
  useColorModeValue,
  Wrap,
  IconButton,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverAnchor,
  Button,
  Portal,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const TagBankDisplay = ({ title, items, type, onTagClick, fetchUserBanks }) => {
  const toast = useToast();
  const bgColor = useColorModeValue('#E4E0E1', '#7d788066');
  const titleColor = useColorModeValue('black', '#f7fafaCC');
  const tagBg = useColorModeValue('#ad998c99', '#ad998c');
  const tagColor = useColorModeValue('#030204CC', 'black');
  const deleteIconColor = useColorModeValue('gray.600', 'gray.400');

  const handleDeleteTag = async (tag) => {
    try {
        const response = await fetch(`/api/items/tags/${type}/${tag}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete tag');
      }

      // Refresh the tag banks after deletion
      await fetchUserBanks();

      toast({
        title: 'Tag Deleted',
        description: `"${tag}" has been removed from your ${title.toLowerCase()}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tag',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="250px" h="200px" bg={bgColor} borderRadius="md" boxShadow="md" p={4}>
      <Text fontSize="lg" fontWeight="500" mb={3} color={titleColor}>
        {title}
      </Text>
      <Box
        overflowY="auto"
        maxH="137px"
        pb={1}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
            marginBottom: '12px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('#D8D2C2', '#544b4a'),
            borderRadius: '24px',
          },
        }}>
        <Wrap spacing={2} mb={1}>
          {items.map((item) => (
            <Box key={item} position="relative" display="inline-block" role="group">
              <Popover>
                <Tag
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  bg={tagBg}
                  color={tagColor}
                  cursor="pointer"
                  pr={8}
                  onClick={() => onTagClick(item)}>
                  <TagLabel>{item}</TagLabel>
                    <Box
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      transition="opacity 0.2s"
                      cursor="pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTag(item);
                      }}
                      opacity={0}
                      _groupHover={{ opacity: 1 }}
                      display="flex"
                      alignItems="center">
                        <DeleteIcon boxSize={3} colod={deleteIconColor} _hover = {{colod: 'red.400'}} />
                    </Box>
                </Tag>
              </Popover>
            </Box>
          ))}
        </Wrap>
      </Box>
    </Box>
  );
};
export default TagBankDisplay;
