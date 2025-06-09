import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Inventory as InventoryIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useState } from 'react';

const drawerWidth = 260;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
    { text: 'New Order', icon: <AddIcon />, path: '/new-order' },
    // { text: 'Products', icon: <InventoryIcon />, path: '/products' },
    // { text: 'Store', icon: <StoreIcon />, path: '/store' },
    // { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderBottom: `1px solid ${theme.palette.divider}`,
  }));

  const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  });

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 3, py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StoreIcon color="primary" sx={{ mr: 1.5, fontSize: '2rem' }} />
          <Typography variant="h6" fontWeight="bold">
            SellerHub
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{
              mb: 0.5,
              borderRadius: 2,
              ...(location.pathname === item.path && {
                backgroundColor: theme.palette.action.selected,
              }),
            }}
          >
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                py: 1.25,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: '40px',
                  color:
                    location.pathname === item.path
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 'medium' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="body2" color="text.secondary">
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <StyledAppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <StyledToolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <Box>
            {/* Placeholder for user profile/notifications */}
          </Box>
        </StyledToolbar>
      </StyledAppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
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
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              background: theme.palette.background.paper,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              background: theme.palette.background.paper,
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
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;