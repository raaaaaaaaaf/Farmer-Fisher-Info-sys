import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Loading from '../src/components/loading/Loading'
import DashboardAppPage from './pages/AdminPages/DashboardAppPage';
import UserPage from './pages/AdminPages/UserPage';
import ProductsPage from './pages/AdminPages/ProductsPage';
import BlogPage from './pages/AdminPages/BlogPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import RegisterPage from './pages/RegisterPage';
import UserPostPage from './pages/UserPages/UserPostPage';
import Modal from './pages/CreatePostModal';
import PostsFullPage from './pages/PostFullPage/PostsFullPage';
import AdminPostPage from './pages/AdminPages/AdminPostPage';
import WeatherApp from './pages/WeatherApp';
// ----------------------------------------------------------------------

export default function Router() {

  const ProtectedRoute = ({children, role}) => {
    const {currentUser, userData, loading} = useContext(AuthContext);
    const [timedOut, setTimedOut] = useState(false);
  
    useEffect(() => {
      // Set a timeout to consider the loading taking too long
      const timeoutId = setTimeout(() => {
        setTimedOut(true);
      }, 2000); // 5 seconds timeout (adjust as needed)
  
      return () => {
        clearTimeout(timeoutId);
      };
    }, []);
  
    if (loading) {
      if (timedOut) {
        // Redirect to login page if loading takes too long
        return <Navigate to="/login" replace />;
      } else {
        return <Loading/>
      }
    }
    if (!currentUser) {
      return <Navigate to={'/login'} replace/>
    }
    if (role && userData.role !== role) {
      if(userData.role === "Admin") {
        return <Navigate to={'/dashboard'}/>
      } else {
        return <Navigate to={'/client'}/>
      }
    }
    return children
  }


  const routes = useRoutes([
    {
      path: 'login',
      element: <LoginPage />,
    },

    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: '/',
      // Redirect to the login page when accessing the root URL
      element: <Navigate to="/login" replace />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <ProtectedRoute role={"Admin"}><Navigate to="/dashboard/app" /></ProtectedRoute>, index: true},
        { path: 'app', element: <ProtectedRoute role={"Admin"}><DashboardAppPage /></ProtectedRoute> },
        { path: 'user', element: <ProtectedRoute role={"Admin"}><UserPage /></ProtectedRoute> },
        { path: 'products', element: <ProtectedRoute role={"Admin"}><ProductsPage /></ProtectedRoute> },
        { path: 'blog', element: <ProtectedRoute role={"Admin"}><BlogPage /></ProtectedRoute> },
        { path: 'posts', element: <ProtectedRoute role={"Admin"}><AdminPostPage /></ProtectedRoute> },
        { path: 'posts/view/:id', element: <ProtectedRoute role={"Admin"}><PostsFullPage /></ProtectedRoute> },
        { path: 'weather', element: <ProtectedRoute role={"Admin"}><WeatherApp /></ProtectedRoute> },
      ],
    },
    {
      path: '/client',
      element: <DashboardLayout />,
      children: [
        { element: <ProtectedRoute role={"User"}><Navigate to="/client/posts" /></ProtectedRoute>, index: true},
        { path: 'weather', element: <ProtectedRoute role={"User"}><WeatherApp /></ProtectedRoute> },
        { path: 'posts', element: <ProtectedRoute role={"User"}><UserPostPage /></ProtectedRoute> },
        { path: 'posts/view/:id', element: <ProtectedRoute role={"User"}><PostsFullPage /></ProtectedRoute> },
        { path: 'modal', element: <ProtectedRoute role={"User"}><Modal /></ProtectedRoute> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
