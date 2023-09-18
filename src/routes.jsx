import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//

import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Loading from '../src/components/loading/Loading'
import DashboardAppPage from './pages/AdminPages/DashboardAppPage';
import UserPage from './pages/AdminPages/UserPage';
import ProductsPage from './pages/AdminPages/ProductsPage';
import BlogPage from './pages/AdminPages/BlogPage';
import UserDashboardAppPage from './pages/UserPages/UserDashboardAppPage';
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

    if (loading) {
      return <Loading/>
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
        { path: 'app', element: <ProtectedRoute role={"User"}><UserDashboardAppPage /></ProtectedRoute> },
        { path: 'user', element: <ProtectedRoute role={"User"}><UserPage /></ProtectedRoute> },
        { path: 'products', element: <ProtectedRoute role={"User"}><ProductsPage /></ProtectedRoute> },
        { path: 'posts', element: <ProtectedRoute role={"User"}><UserPostPage /></ProtectedRoute> },
        { path: 'posts/view/:id', element: <ProtectedRoute role={"User"}><PostsFullPage /></ProtectedRoute> },
        { path: 'modal', element: <ProtectedRoute role={"User"}><Modal /></ProtectedRoute> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
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
