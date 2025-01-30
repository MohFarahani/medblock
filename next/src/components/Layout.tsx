'use client';

import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Download, Upload, Preview } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DRAWER_WIDTH = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = [
    { text: 'Download', icon: <Download />, path: '/download' },
    { text: 'Upload', icon: <Upload />, path: '/upload' },
    { text: 'Preview', icon: <Preview />, path: '/preview' },
  ];

  const handleListItemClick = (path: string, index: number) => {
    setSelectedIndex(index);
    router.push(path);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <List sx={{ marginTop: '64px' }}>
          {menuItems.map((item, index) => (
            <ListItemButton
              key={item.text}
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(item.path, index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box
        flexGrow={1}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;