'use client';

import { 
  AppBar,
  Box, 
  Drawer, 
  IconButton,
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import { Download, Upload, Preview, Menu } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DRAWER_WIDTH = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: 'Download', icon: <Download />, path: '/download' },
    { text: 'Upload', icon: <Upload />, path: '/upload' },
    { text: 'Preview', icon: <Preview />, path: '/preview' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (path: string, index: number) => {
    setSelectedIndex(index);
    setMobileOpen(false);
    router.push(path);
  };

  const drawer = (
    <Box sx={{ bgcolor: 'background.default' }}>
      <List sx={{ marginTop: { xs: '16px', sm: '64px' } }}>
        {menuItems.map((item, index) => (
          <ListItemButton
            key={item.text}
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(item.path, index)}
            sx={{
              margin: '8px 16px',
              borderRadius: '8px',
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile AppBar */}
      <AppBar position="fixed" sx={{ display: { sm: 'none' } }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems[selectedIndex].text}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: DRAWER_WIDTH },
          flexShrink: { sm: 0 },
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginTop: { xs: '64px', sm: 0 },
          height: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;