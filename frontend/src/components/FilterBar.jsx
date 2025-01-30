import React from 'react';
import {
  Box,
  Button,
  Collapse,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  useDisclosure,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { FilterIcon, SearchIcon } from 'lucide-react';
import FilterMenuButton from './FilterMenuButton';

//Filter bar on ClosetPage. Expands from a dropdown.

const FilterBar = ({
  availableCategories,
  availableHues,
  availableTags,
  selectedFilters,
  onFilterChange,
  valueRange,
}) => {
  const { isOpen, onToggle } = useDisclosure();

  //Color definitions
  const bgColor = useColorModeValue('#E4E0E1', '#7d788066');
  const buttonText = useColorModeValue('black', '#f7fafaCC');
  const buttonBg = useColorModeValue('#D8D2C2', '#908382CC');
  const buttonHover = useColorModeValue('#c3ba97', '#908382');
  const textColor = useColorModeValue('black', '#f7fafaCC');
  const underlineColor = useColorModeValue('#D8D2C2', '#D8D2C299');

  // Count active filters
  const activeFilterCount =
    selectedFilters.categories.length +
    selectedFilters.hues.length +
    selectedFilters.tags.length +
    (valueRange.min > 0 || valueRange.max < 1000 ? 1 : 0);

  return (
    <Box w="80%" mb={4}>
      {/* Filter Button */}
      <Box
        w="fit-content" // Changed from 100% to fit-content
        p={2}
        cursor="pointer"
        onClick={onToggle}
        display="flex"
        alignItems="center"
        position="relative"
        transition="all 0.2s"
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '1.6px',
          bg: underlineColor,
          transition: 'transform 0.1s',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
        }}
        _hover={{
          _after: {
            transform: 'scaleX(1.5)',
          },
        }}>
        <HStack spacing={2} color={textColor}>
          <FilterIcon boxSize={4} />
          <Text fontSize="lg" fontWeight="500" paddingRight={2}>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Text>
          {isOpen ? <ChevronUpIcon boxSize={4} /> : <ChevronDownIcon boxSize={4} />}
        </HStack>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={isOpen}>
        <Box w="100%" bg='transparent' pl={7} mt={0}>
          <HStack spacing={6} wrap="wrap" align="flex-start">
            {/* Categories Menu */}
            <Menu closeOnSelect={false}>
              <FilterMenuButton as={MenuButton} label="Categories" count={selectedFilters.categories.length} />
              <MenuList maxH="300px" overflowY="auto">
                <MenuOptionGroup
                  type="checkbox"
                  value={selectedFilters.categories}
                  onChange={(values) => onFilterChange('categories', values)}>
                  {availableCategories.map((category) => (
                    <MenuItemOption key={category} value={category}>
                      {category}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>

            {/* Hues Menu */}
            <Menu closeOnSelect={false}>
              <FilterMenuButton as={MenuButton} label="Hues" count={selectedFilters.hues.length} />
              <MenuList maxH="300px" overflowY="auto">
                <MenuOptionGroup
                  type="checkbox"
                  value={selectedFilters.hues}
                  onChange={(values) => onFilterChange('hues', values)}>
                  {availableHues.map((hue) => (
                    <MenuItemOption key={hue} value={hue}>
                      {hue}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>

            {/* Tags Menu */}
            <Menu closeOnSelect={false}>
              <FilterMenuButton as={MenuButton} label="Tags" count={selectedFilters.tags.length} />
              <MenuList maxH="300px" overflowY="auto">
                <MenuOptionGroup
                  type="checkbox"
                  value={selectedFilters.tags}
                  onChange={(values) => onFilterChange('tags', values)}>
                  {availableTags.map((tag) => (
                    <MenuItemOption key={tag} value={tag}>
                      {tag}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>

            {/* Value Range Menu */}
            <Menu>
              <FilterMenuButton
                as={MenuButton}
                label="Value"
                count={valueRange.min > 0 || valueRange.max < 1000 ? '✓' : undefined}
              />
              <MenuList p={4} minW="300px">
                <Text mb={2}>
                  ${valueRange.min} - ${valueRange.max}
                </Text>
                <RangeSlider
                  min={0}
                  max={1000}
                  step={10}
                  value={[valueRange.min, valueRange.max]}
                  onChange={(values) =>
                    onFilterChange('valueRange', {
                      min: values[0],
                      max: values[1],
                    })
                  }>
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
              </MenuList>
            </Menu>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <Button
                variant="unstyled"
                onClick={() => onFilterChange('clear')}
                color={textColor}
                fontSize="md"
                height="auto"
                padding={2}
                position="relative"
                _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '100%',
                  height: '1px',
                  bg: underlineColor,
                  transition: 'transform 0.3s',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                }}
                _hover={{
                  _after: {
                    transform: 'scaleX(1)',
                  },
                }}>
                Clear All
              </Button>
            )}
          </HStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default FilterBar;
