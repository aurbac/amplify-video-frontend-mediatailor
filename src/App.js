import React from 'react'
import { Amplify } from 'aws-amplify';

import VideoPlayer from './components/VideoPlayer';
import VideoChat from './components/VideoChat';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import VideocamIcon from '@mui/icons-material/Videocam';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App({ signOut, user }) {
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
      type: 'video/mp4'
    }]
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <VideocamIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Video Streaming
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem>Signed in as &nbsp;<strong>{user.username}</strong></MenuItem>
              <MenuItem onClick={signOut}>Sign out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    
      <Container maxWidth="xl" sx={{ pt: '20px'  }}>
        <Grid container spacing={3}>
        
          <Grid item sm={12} md={8}>
            <VideoPlayer {...videoJsOptions} />
          </Grid>
          <Grid item sm={12} md={4}>
            <VideoChat />
          </Grid>
        
        </Grid>
      </Container>
      
    </>
  );
}

export default withAuthenticator(App);
