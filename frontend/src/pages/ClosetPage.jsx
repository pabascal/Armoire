import { Container, Text, VStack, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useItemStore } from '../store/item';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { useSelector } from 'react-redux';

const ClosetPage = () => {
  const items = useItemStore((state) => state.items);
  const fetchItems = useItemStore((state) => state.fetchItems);
  const { user, isAuthenticated, token } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchItems(token);
    }
  }, [isAuthenticated, token, fetchItems]);

  if (!isAuthenticated || !token) {
    return (
      <Container>
        <Text>You need to log in to view your closet.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={0}>
      <VStack spacing={6}>
        <VStack spacing={0}>
        <Text fontSize={'20'} mt={4}></Text>
        </VStack>
        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 3,
          }}
          spacing={10}
          w={'full'}>
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </SimpleGrid>

        {items.length === 0 && (
          <Text fontSize="xl" textAlign={'center'} fontWeight="bold" color="gray.500">
            No Garmets found {'   '}
            <Link to={'/create'}>
              <Text as="span" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Create a Garment
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
};
export default ClosetPage;
