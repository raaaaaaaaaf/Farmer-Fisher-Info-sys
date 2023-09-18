import PropTypes from 'prop-types';
import { set, sub } from 'date-fns';
import { noCase } from 'change-case';
import { faker } from '@faker-js/faker';
import { useContext, useEffect, useState } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import _ from 'lodash';
import { AuthContext } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
// ---------------------------------------------------------------------

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const {currentUser} = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = []
        const notifRef = query(collection(db, "notification"))
        const notifSnap = await getDocs(notifRef)
        notifSnap.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data()
          })
        })
        setNotifications(data)

      } catch(err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const sortedDocData = _.sortBy(notifications, (data) => data.createdAt.seconds).reverse();

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const [open, setOpen] = useState(null);

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };


  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
      {loading ? (
        <div>...</div>
      ) : (
        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {sortedDocData.slice(0, 2).map((notification, index) => (
              <NotificationItem key={notification.id} notification={notification} index={index}/>
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {sortedDocData.slice(2, 5).map((notification, index) => (
              <NotificationItem key={notification.id} notification={notification} index={index}/>
            ))}
          </List>
        </Scrollbar>
      )}


        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    author: PropTypes.string,
    description: PropTypes.string,
    photoURL: PropTypes.any,
  }),
  index: PropTypes.number,
};

function NotificationItem({ notification }) {
  const { avatar, title, postDataID } = renderContent(notification);
  const setIsUnRead = async (id) => {
    try {
      const notifRef = doc(db, "notification", id)
      await updateDoc(notifRef, {
        isUnRead: false
      })
    } catch(err) {
      console.error(err);
    }
  }
  return (
    <Link to={`posts/view/${postDataID}`} style={{ textDecoration: 'none', color: 'black'}}>
        <ListItemButton
    onClick={() => setIsUnRead(notification.id)}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {notification.createdAt ? (
              fToNow(new Date(notification.createdAt.seconds * 1000))
            ) : (
              'N/A' // Or some default value if createdAt is not defined
            )}
          </Typography>
        }
      />
    </ListItemButton>
    </Link>

  );
}

// ----------------------------------------------------------------------

function renderContent(notification, index) {
  const title = (
    <Typography variant="subtitle2">
      {notification.author}
      {notification.description && typeof notification.description === 'string' && (
        <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp; {noCase(notification.description)}
        </Typography>
      )}
    </Typography>
  );
  const postDataID = notification.postDataID
 
  return {
    avatar: notification.photoURL ? <img alt={notification.author} src={notification.photoURL} /> : <img alt={notification.author} src={ "/assets/images/avatars/avatar_2.jpg "}/>,
    title, postDataID,
  };
}

