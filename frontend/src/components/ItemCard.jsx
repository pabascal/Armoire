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
import TagInput from './TagInputs';

const ItemCard = ({ item }) => {
  const [updatedItem, setUpdatedItem] = useState(item);
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const bg = useColorModeValue('white', 'gray.800');
  const [imagePreview, setImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { deleteItem, updateItem } = useItemStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  //modular color definitions
  const editButtonBg = useColorModeValue('#62524799', '#cc976699');
  const editButtonHover = useColorModeValue('#625247CC', '#cc9766CC');
  const deleteButtonBg = useColorModeValue('#96443899', '#96443899');
  const deleteButtonHover = useColorModeValue('#964438CC', '#964438CC');
  const iconColor = useColorModeValue('white', 'gray.300');

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
        formData.append(
          'categories',
          Array.isArray(updatedItem.categories) ? updatedItem.categories.join(', ') : updatedItem.categories,
        );
        formData.append('hues', Array.isArray(updatedItem.hues) ? updatedItem.hues.join(', ') : updatedItem.hues);
        formData.append('tags', Array.isArray(updatedItem.tags) ? updatedItem.tags.join(', ') : updatedItem.tags);
        formData.append('sellvalue', updatedItem.sellvalue || '');

        result = await updateItem(pid, formData);
      } else {
        const updateData = {
          name: updatedItem.name,
          categories: Array.isArray(updatedItem.categories)
            ? updatedItem.categories.join(', ')
            : updatedItem.categories,
          hues: Array.isArray(updatedItem.hues) ? updatedItem.hues.join(', ') : updatedItem.hues,
          tags: Array.isArray(updatedItem.tags) ? updatedItem.tags.join(', ') : updatedItem.tags,
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
    <Box role='group' position='relative'>
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
      position="relative">
      <Image src={item.image} alt={item.name} h="auto" maxH="450px" w="full" objectFit="cover" />
      <Box p={4}>
        <Heading as="h3" size="md" mb={2} fontWeight="500" textAlign="center">
          {item.name}
        </Heading>
        <HStack
          spacing={2}
          position="absolute"
          bottom="10px"
          right="10px"
          opacity={0}
          transition="opacity 0.3s"
          _groupHover={{ opacity: 1 }}>
          <IconButton
            icon={<Box as={EditIcon} boxSize={3.5} color={iconColor} />}
            onClick={onOpen}
            bg={editButtonBg}
            _hover={{ bg: editButtonHover }}
            boxSize='7'
          />
          <IconButton
            icon={<Box as={DeleteIcon} boxSize={3.5} color={iconColor} />}
            onClick={() => handleDeleteItem(item._id)}
            bg={deleteButtonBg}
            _hover={{ bg: deleteButtonHover }}
            boxSize='7'
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
              <TagInput
                placeholder="Add Category"
                value={updatedItem.categories}
                onChange={(value) => setUpdatedItem({ ...updatedItem, categories: value })}
                type="categories"
              />
              <TagInput
                placeholder="Add Hue"
                value={updatedItem.hues}
                onChange={(value) => setUpdatedItem({ ...updatedItem, hues: value })}
                type="hues"
              />
              <TagInput
                placeholder="Add Tag"
                value={updatedItem.tags}
                onChange={(value) => setUpdatedItem({ ...updatedItem, tags: value })}
                type="tags"
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
    </Box>
  );
};
export default ItemCard;
