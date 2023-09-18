// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const userConfig = [
  {
    title: 'dashboard',
    path: '/client/posts',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/client/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/client/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/client/blog',
    icon: icon('ic_blog'),
  },

];

export default userConfig;
