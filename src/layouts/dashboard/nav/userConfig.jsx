// component
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const userConfig = [
  {
    title: 'Home',
    path: '/client/posts',
    icon: <Iconify icon={'carbon:blog'}/>,
  },
  {
    title: 'Weather',
    path: '/client/weather',
    icon: <Iconify icon={'material-symbols:weather-mix-outline'}/>,
  },


];

export default userConfig;
