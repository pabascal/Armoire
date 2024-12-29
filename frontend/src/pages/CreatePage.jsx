import { useState } from 'react';
import { VStack, Button } from '@chakra-ui/react';
import {useItemStore } from '../store/item';
import ItemModal from '../components/ItemModal';

const CreatePage = () => {

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const openItemModal = () => setIsItemModalOpen(true);
  const closeItemModal = () => setIsItemModalOpen(false);

  return (
    <VStack spacing={4}>
      <Button colorScheme="teal" onClick={openItemModal}>
        Add Clothing Item
      </Button>

      {/* Modals */}
      <ItemModal isOpen={isItemModalOpen} onClose={closeItemModal} />
    </VStack>
  );
};
export default CreatePage;
