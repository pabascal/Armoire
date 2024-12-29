import { Box, Button, Container, Flex, HStack, Text, useColorMode, useToast, Avatar, Tooltip } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { IoMoon } from 'react-icons/io5';
import { LuSun } from 'react-icons/lu';
import { FaShirt } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/user.js';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => ({
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user  // getting the nested user object
  }));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast({
      title: 'Logged Out',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <Container maxW={'1140px'} px={4}>
      <Flex
        h={16}
        alignItems={'center'}
        justifyContent={'space-between'}
        flexDir={{
          base: 'column',
          sm: 'row',
        }}>
        <Text
          fontSize={{ base: '26', sm: '33' }}
          fontWeight={'bold'}
          textTransform={'uppercase'}
          textAlign={'center'}
          bgGradient={'linear(to-r, purple.600, red.300, purple.600)'}
          bgClip={'text'}>
          <Link to={'/'}>Armoire</Link>
        </Text>
        <HStack spacing={2} alignItems={'center'}>
          {isAuthenticated ? (
            <>
              <Link to={'/create'}>
                <Button>
                  <PlusSquareIcon fontSize={20} />
                </Button>
              </Link>
              <Link to={'/closet'}>
                <Button>
                  <FaShirt fontSize={20} />
                </Button>
              </Link>
              <Button onClick={handleLogout}>Log Out</Button>

            </>
          ) : (
            <Link to={'/'}>
              <Button>Log In</Button>
            </Link>
          )}
          <Button onClick={toggleColorMode}>{colorMode === 'light' ? <IoMoon /> : <LuSun size="20" />}</Button>
          <Tooltip label={`${user?.name}`} placement="bottom">
          <Avatar w={'40px'} h={'32px'} name={user?.name}  bg='purple.500' color='white' />
          </Tooltip>
        </HStack>
      </Flex>
    </Container>
  );
};
export default Navbar;
