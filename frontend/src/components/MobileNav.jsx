import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
  Avatar,
  Tooltip,
  useColorModeValue,
  VStack,
  IconButton,
  ButtonGroup
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { IoMoon } from 'react-icons/io5';
import { LuSun } from 'react-icons/lu';
import { FaShirt } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/user.js';
import { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

const MobileNav = ({ isAuthenticated, handleLogout, toggleColorMode, colorMode, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const avatarBg = useColorModeValue('gray.300', 'gray.700');
  const avatarColor = useColorModeValue('gray.700', 'gray.300');
  const menuBg = useColorModeValue('white', 'gray.800');

  return (
    <Box position="relative">
      <ButtonGroup isAttached={true} minH="4vh">
        <Avatar
          onClick={() => setIsOpen(!isOpen)}
          cursor="pointer"
          w={'48px'}
          h={'40px'}
          name={user?.name}
          bg={avatarBg}
          color={avatarColor}
          borderRadius='2px'
        />
        <IconButton
          aria-label="Open menu"
          icon={<LuChevronDown />}
          w={'30px'}
          h={'40px'}
          onClick={() => setIsOpen(!isOpen)}
          bg={avatarBg}
          color={avatarColor}
          borderRadius='2px'
        />
      </ButtonGroup>

      {isOpen && (
        <VStack
          position="absolute"
          top="100%"
          right={0}
          mt={2}
          bg={menuBg}
          rounded="md"
          shadow="lg"
          p={2}
          spacing={2}>
          {isAuthenticated ? (
            <>
              <Link to={'/create'}>
                <Button width="65px">
                  <PlusSquareIcon fontSize={20} />
                </Button>
              </Link>
              <Link to={'/closet'}>
                <Button width="65px">
                  <FaShirt fontSize={20} />
                </Button>
              </Link>
              <Button width="65px" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <Link to={'/'}>
              <Button width="65px">Log In</Button>
            </Link>
          )}
          <Button width="full" onClick={toggleColorMode}>
            {colorMode === 'light' ? <IoMoon /> : <LuSun size="20" />}
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default MobileNav;
