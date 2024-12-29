import {
  Box,
  useColorModeValue,
  Text,
  IconButton,
  Image,
  VStack,
  Heading,
  HStack,
  useToast,
  Modal,
  useDisclosure,
  Input,
  Button,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useItemStore } from '../store/item';
import { ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, ModalContent, ModalFooter } from '@chakra-ui/react';
import { useState } from 'react';

const ItemCard = ({ item }) => {
  const [updatedItem, setUpdatedItem] = useState(item);
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const bg = useColorModeValue('white', 'gray.800');

  const { deleteItem, updateItem } = useItemStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteItem = async (pid) => {
    const { success, message } = await deleteItem(pid);
    if (!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Success',
        description: message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateItem = async (pid, updatedItem) => {
    try{
    const updatedItemData = {
      ...updatedItem,
      categories: Array.isArray(updatedItem.categories)
        ? updatedItem.categories
        : updatedItem.categories?.split(',').map((item) => item.trim()) ?? [],
      hues: Array.isArray(updatedItem.hues)
        ? updatedItem.hues
        : updatedItem.hues?.split(',').map((item) => item.trim()) ?? [],
      tags: Array.isArray(updatedItem.tags)
        ? updatedItem.tags
        : updatedItem.tags?.split(',').map((item) => item.trim()) ?? [],
      sellvalue: parseFloat(updatedItem.sellvalue) || 0,
    };

    const result = await updateItem(pid, updatedItemData);
    
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Item Updated Successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: 'Error',
        description: result.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
   } catch (error) {
      console.error('Update failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const imageUrl = `http://localhost:5000/uploads/${item.image}`;
  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}>
      <Image src={imageUrl} alt={item.name} h='auto' maxH="450px" w="full" objectFit="cover" />
      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {item.name}
        </Heading>

        <HStack spacing={2}>
          <IconButton icon={<Box as ={EditIcon} boxSize={3.5} />} onClick={onOpen} colorScheme="blue" boxSize='6' />
          <IconButton icon={<Box as ={DeleteIcon} boxSize={3.5} />} onClick={() => handleDeleteItem(item._id)} colorScheme="red" boxSize='6' />
        </HStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        ;
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Item Name"
                name="name"
                value={updatedItem.name}
                onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })}
              />
              <Input
                placeholder="Category (i.e. pants, joggers)"
                name="categories"
                value={updatedItem.categories}
                onChange={(e) => setUpdatedItem({ ...updatedItem, categories: e.target.value })}
              />
              <Input
                placeholder="Hue (i.e. green, earthy)"
                name="hues"
                value={updatedItem.hues}
                onChange={(e) => setUpdatedItem({ ...updatedItem, hues: e.target.value })}
              />
              <Input
                placeholder="Tags (i.e. business, dress)"
                name="tags"
                value={updatedItem.tags}
                onChange={(e) => setUpdatedItem({ ...updatedItem, tags: e.target.value })}
              />
              <Input
                placeholder="Value"
                name="sellvalue"
                type="number"
                value={updatedItem.sellvalue}
                onChange={(e) => setUpdatedItem({ ...updatedItem, sellvalue: e.target.value })}
              />
              <Input
                placeholder="Image File"
                type='file'
                name="image"
                accept='image/*'
                onChange={(e) => setUpdatedItem({ ...updatedItem, image: e.target.files[0] })}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => handleUpdateItem(item._id, updatedItem)}>
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              {' '}
              Cancel{' '}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default ItemCard;
