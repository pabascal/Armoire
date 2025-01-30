import {
  Container,
  Text,
  VStack,
  SimpleGrid,
  Box,
  useBreakpointValue,
  Grid,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useItemStore } from '../store/item';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { useSelector } from 'react-redux';
import ClosetRack from '../components/ClosetRack';
import FilterBar from '../components/FilterBar';

const ClosetPage = () => {
  const items = useItemStore((state) => state.items);
  const fetchItems = useItemStore((state) => state.fetchItems);
  const { user, isAuthenticated, token } = useSelector((state) => state.user);
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 }) || 1;
  const rackColor = useColorModeValue('gray.300', 'gray.600');
  const numberOfItems = items.length;
  const rows = Math.ceil(numberOfItems / 3);
  const { categoryBank, hueBank, tagBank, fetchUserBanks } = useItemStore();

  //Filtration
  const [filters, setFilters] = useState({
    categories: [],
    hues: [],
    tags: [],
    valueRange: { min: 0, max: 1000 },
  });
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    fetchUserBanks();
  }, []);

  useEffect(() => {
    const newFilteredItems = filterItems(items, filters);
    setFilteredItems(newFilteredItems);
  }, [items, filters]);

  //Authentication
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchItems(token);
    }
  }, [isAuthenticated, token, fetchItems]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({
        categories: [],
        hues: [],
        tags: [],
        valueRange: { min: 0, max: 1000 },
      });
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filterItems = (items, filters) => {
    return items.filter(item => {
      // Helper function to normalize string or array into array of trimmed strings
      const normalizeArray = (value) => {
        if (Array.isArray(value)) return value.map(v => v.trim());
        if (typeof value === 'string') return value.split(',').map(v => v.trim());
        return [];
      };
  
      // Get normalized arrays of item's tags
      const itemCategories = normalizeArray(item.categories);
      const itemHues = normalizeArray(item.hues);
      const itemTags = normalizeArray(item.tags);
  
      // Debug logging to see what we're working with
      console.log('Item categories:', itemCategories);
      console.log('Selected filter categories:', filters.categories);
  
      // Check if any selected filter matches with item's tags
      const categoryMatch = filters.categories.length === 0 || 
        itemCategories.some(itemCategory => 
          filters.categories.includes(itemCategory)
        );
  
      const hueMatch = filters.hues.length === 0 || 
        itemHues.some(itemHue => 
          filters.hues.includes(itemHue)
        );
  
      const tagMatch = filters.tags.length === 0 || 
        itemTags.some(itemTag => 
          filters.tags.includes(itemTag)
        );
  
      // Check value range
      const valueMatch = 
        (!item.sellvalue && filters.valueRange.min === 0) || 
        (parseFloat(item.sellvalue) >= filters.valueRange.min && 
         parseFloat(item.sellvalue) <= filters.valueRange.max);
  
      return categoryMatch && hueMatch && tagMatch && valueMatch;
    });
  };

  //Page layout
  const groupIntoRows = (items, colCount) => {
    return items.reduce((rows, item, index) => {
      if (index % colCount === 0) rows.push([]);
      rows[rows.length - 1].push(item);
      return rows;
    }, []);
  };

  const itemRows = groupIntoRows(filteredItems, columns);

  if (!isAuthenticated || !token) {
    return (
      <Container>
        <Text>You need to log in to view your closet.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={0}>
      <VStack spacing={6} align="stretch">
        {/* Filter Bar */}
        <FilterBar
          availableCategories={categoryBank}
          availableHues={hueBank}
          availableTags={tagBank}
          selectedFilters={filters}
          onFilterChange={handleFilterChange}
          valueRange={filters.valueRange}
        />

        {/* Item Display */}
        {itemRows.length > 0 ? (
          itemRows.map((row, rowIndex) => (
            <Box
              key={rowIndex}
              width="100%"
              position="relative"
              display="flex"
              justifyContent={row.length < columns ? 'center' : 'flex-start'} // Center incomplete rows
            >
              <ClosetRack cardCount={row.length}>
                {row.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </ClosetRack>
            </Box>
          ))
        ) : (
          // Show when no items match filters
          <Box width="100%" textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">
              No items match the selected filters
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};
export default ClosetPage;
