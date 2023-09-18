// component
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify'

// ----------------------------------------------------------------------


const adminConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: <Iconify icon={'carbon:analytics'}/>,
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: <Iconify icon={'mdi:users-outline'}/>,
  },
  {
    title: 'Posts',
    path: '/dashboard/posts',
    icon: <Iconify icon={'carbon:blog'}/>,
  },
  {
    title: 'Weather',
    path: '/dashboard/weather',
    icon: <Iconify icon={'material-symbols:weather-mix-outline'}/>,
  },


];

export default adminConfig;
