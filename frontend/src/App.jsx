import { Box, Button, useColorModeValue } from '@chakra-ui/react';
import { Route, Routes, Navigate } from 'react-router-dom';
import CreatePage from './pages/CreatePage';
import ClosetPage from './pages/ClosetPage';
import HomePage from './pages/HomePage';
import Navbar from './components/NavBar';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { login } from './store/user';


function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        dispatch(
          login({
            user: JSON.parse(storedUser),
            token: storedToken,
          })
        );
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, [dispatch]);

  return (
      <Box minH={'100vh'} bg={useColorModeValue('gray.200', 'red.950')}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route 
            path="/closet" 
            element={isAuthenticated ? <ClosetPage /> : <Navigate to="/closet" />} 
          />
        </Routes>
      </Box>
  );
}

export default App;
