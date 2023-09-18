import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { fDateTime } from '../../utils/formatTime';
import './Main.css';
function Main({posts}) {
  const { title, description, content, author, createdAt } = posts;

  return (
    <Grid item xs={12} md={12} className="blog-post">
      <Divider className="divider" />
      <Typography variant="h2" className="post-title">
        {title}
      </Typography>
      <Typography variant="body1" className="post-info">
        {fDateTime(new Date(createdAt.seconds * 1000).toLocaleString("en-US"))} by {author}
      </Typography>
      <Typography variant="body1" className="post-content">
        {content}
      </Typography>
    </Grid>
  );
};

Main.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  content: PropTypes.string,
};

export default Main;