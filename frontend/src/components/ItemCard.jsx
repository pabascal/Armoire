import {
  Box,
  useColorModeValue,
  Text,
  IconButton,
  Image,
  VStack,
  Heading,
  Spinner,
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
  const [imagePreview, setImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
    setIsUpdating(true);
    try {
      let result; // Declare result here

      if (updatedItem.image instanceof File) {
        const formData = new FormData();
        formData.append('image', updatedItem.image);
        formData.append('name', updatedItem.name);
        formData.append('categories', updatedItem.categories);
        formData.append('hues', updatedItem.hues);
        formData.append('tags', updatedItem.tags);
        formData.append('sellvalue', updatedItem.sellvalue || '');

        result = await updateItem(pid, formData);
      } else {
        const updateData = {
          name: updatedItem.name,
          categories: updatedItem.categories,
          hues: updatedItem.hues,
          tags: updatedItem.tags,
          sellvalue: updatedItem.sellvalue || '',
        };
        result = await updateItem(pid, updateData);
      }

      if (!result) {
        throw new Error('Update returned no result');
      }

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
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update item',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}>
      <Image src={item.image} alt={item.name} h="auto" maxH="450px" w="full" objectFit="cover" />
      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {item.name}
        </Heading>

        <HStack spacing={2}>
          <IconButton icon={<Box as={EditIcon} boxSize={3.5} />} onClick={onOpen} colorScheme="blue" boxSize="6" />
          <IconButton
            icon={<Box as={DeleteIcon} boxSize={3.5} />}
            onClick={() => handleDeleteItem(item._id)}
            colorScheme="red"
            boxSize="6"
          />
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
                value={updatedItem.sellvalue ?? ''}
                onChange={(e) => setUpdatedItem({ ...updatedItem, sellvalue: e.target.value })}
              />
              <Input
                placeholder="Image File"
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setUpdatedItem({ ...updatedItem, image: file });
                  // Optional: show preview
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateItem(item._id, updatedItem)}
              isDisabled={isUpdating}>
              {isUpdating ? (
                <HStack spacing={2}>
                  <Spinner size="sm" />
                  <Text>Updating...</Text>
                </HStack>
              ) : (
                'Update'
              )}
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
