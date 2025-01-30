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
  ButtonGroup,
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
  const avatarBg = useColorModeValue('#E4E0E1', 'gray.700');
  const avatarColor = useColorModeValue('gray.700', 'gray.300');
  const menuBg = useColorModeValue('#E4E0E1', 'gray.800');

  return (
    <Box position="relative" display="inline-block">
      <ButtonGroup isAttached={true} display="flex" alignItems="center">
        <Avatar
          onClick={() => setIsOpen(!isOpen)}
          cursor="pointer"
          w={'48px'}
          h={'40px'}
          name={user?.name}
          bg={avatarBg}
          color={avatarColor}
          borderRadius="2px"
        />
        <IconButton
          aria-label="Open menu"
          icon={<LuChevronDown />}
          w={'20px'}
          h={'40px'}
          minW={0}
          onClick={() => setIsOpen(!isOpen)}
          bg={avatarBg}
          color={avatarColor}
          borderRadius="2px"
          _active={{ bg: avatarBg, color: avatarColor }}
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
          spacing={2}
          minW="60px"
          zIndex={10}
          alignItems="center">
          {isAuthenticated ? (
            <>
              <Link to={'/create'} style={{ width: '100%' }}>
                <Button width="45px" p={1}>
                  <PlusSquareIcon boxSize='21px'
                  />
                </Button>
              </Link>
              <Link to={'/closet'} style={{ width: '100%' }}>
                <Button width="45px">
                  <FaShirt
                    style={{
                      minWidth: '17px',
                      width: '17px',
                    }}
                  />
                </Button>
              </Link>
              <Button width="45px" onClick={handleLogout} fontSize={11}>
                Log Out
              </Button>
            </>
          ) : (
            <Link to={'/'}>
              <Button width="45px">Log In</Button>
            </Link>
          )}
          <Button width="45px" onClick={toggleColorMode}>
            {colorMode === 'light' ? <IoMoon /> : <LuSun size="20" />}
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default MobileNav;
