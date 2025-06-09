import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  Chip,
  Stack,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Delete as DeleteIcon, Search, Add, LocalOffer, Person, Place, Sell } from '@mui/icons-material';
import { addOrder } from '../store/ordersSlice';
import { updateInventory } from '../store/productsSlice';
import type { RootState } from '../store';
import type { OrderItem, Product } from '../types';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const NewOrder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [notes, setNotes] = useState('');
  const [customer, setCustomer] = useState('');
  const [market, setMarket] = useState('India (INR ₹)');
  const [tags, setTags] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Invoice modal state
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [toEmail, setToEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [bccEmail, setBccEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleProductChange = (event: SelectChangeEvent) => {
    setSelectedProduct(event.target.value);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value) || 0);
  };

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    setDiscountPercentage(Math.min(Math.max(value, 0), 100));
  };

  const handleAddItem = () => {
    const product = products.find((p: Product) => p.id === selectedProduct);
    if (product && quantity > 0 && quantity <= product.inventory) {
      const newItem: OrderItem = {
        productId: product.id,
        quantity,
        price: product.price,
      };
      setOrderItems([...orderItems, newItem]);
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    const product = products.find((p: Product) => p.id === orderItems[index].productId);
    if (product && newQuantity > 0 && newQuantity <= product.inventory) {
      const updatedItems = [...orderItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity,
      };
      setOrderItems(updatedItems);
    }
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discountPercentage) / 100;
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };

  const handleCreateOrder = () => {
    if (orderItems.length === 0) return;
    const { total } = calculateTotals();
    const newOrder = {
      id: Date.now().toString(),
      items: orderItems,
      total,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      customer,
      notes,
      tags: tags.split(',').map(tag => tag.trim()),
    };
    dispatch(addOrder(newOrder));
    orderItems.forEach((item: OrderItem) => {
      dispatch(updateInventory({ productId: item.productId, quantity: item.quantity }));
    });
    navigate('/');
  };

  // Invoice modal handlers
  const handleOpenInvoiceModal = () => {
    setInvoiceModalOpen(true);
    setSendSuccess(false);
    setToEmail('');
    setCcEmail('');
    setBccEmail('');
    setMessage('');
  };
  const handleCloseInvoiceModal = () => {
    setInvoiceModalOpen(false);
    setSendLoading(false);
    setSendSuccess(false);
  };
  const handleSendInvoice = () => {
    setSendLoading(true);
    setTimeout(() => {
      setSendLoading(false);
      setSendSuccess(true);
      setTimeout(() => {
        setInvoiceModalOpen(false);
        setSendSuccess(false);
      }, 1200);
    }, 1200);
  };

  const { subtotal, discountAmount, total } = calculateTotals();
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: isMobile ? 1 : 3,
      backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.background.default,
      minHeight: '100vh'
    }}>
      <Typography 
        variant={isMobile ? 'h5' : 'h4'} 
        gutterBottom 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold',
          color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light
        }}
      >
        Create New Order
      </Typography>
      
      <Grid container spacing={isMobile ? 1 : 3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Products Card */}
          <Card sx={{ 
            mb: isMobile ? 2 : 3, 
            borderRadius: 2, 
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.background.paper
          }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  alignItems: 'center',
                  color: theme.palette.text.primary
                }}
              >
                <Sell sx={{ mr: 1, color: theme.palette.primary.main }} /> Products
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: isMobile ? 1 : 2, 
                mb: 3,
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <TextField
                  placeholder="Search products"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setModalOpen(true)}
                  sx={{ 
                    borderRadius: 1,
                    ...(isMobile && { width: '100%' })
                  }}
                >
                  Browse
                </Button>
              </Box>
              
              {/* Product selection */}
              <Box sx={{ 
                display: 'flex', 
                gap: isMobile ? 1 : 2, 
                mb: 3, 
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <Select
                  size="small"
                  value={selectedProduct}
                  onChange={handleProductChange}
                  displayEmpty
                  sx={{ 
                    minWidth: isMobile ? '100%' : 200, 
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.default
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a product
                  </MenuItem>
                  {filteredProducts.map((product: Product) => (
                    <MenuItem
                      key={product.id}
                      value={product.id}
                      disabled={product.inventory === 0}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={product.image} sx={{ width: 24, height: 24 }} />
                        <Box>
                          <Typography>{product.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.inventory > 0 
                              ? `${product.inventory} available` 
                              : 'Out of stock'}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
                
                <TextField
                  size="small"
                  type="number"
                  label={isMobile ? "Qty" : "Quantity"}
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, style: { width: isMobile ? 60 : 80 } }}
                  sx={{ 
                    borderRadius: 1,
                    ...(isMobile && { width: '100%' })
                  }}
                />
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddItem}
                  disabled={!selectedProduct || quantity <= 0}
                  sx={{ 
                    borderRadius: 1,
                    ...(isMobile && { width: '100%' })
                  }}
                >
                  Add
                </Button>
              </Box>
              
              {/* Cart List */}
              <Paper variant="outlined" sx={{ 
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper
              }}>
                <List>
                  {orderItems.length === 0 ? (
                    <ListItem sx={{ py: 3 }}>
                      <ListItemText 
                        primary="Your cart is empty"
                        secondary="Add products to start creating an order"
                        primaryTypographyProps={{ 
                          color: 'text.secondary', 
                          textAlign: 'center',
                          variant: isMobile ? 'body1' : 'h6'
                        }}
                        secondaryTypographyProps={{ 
                          textAlign: 'center',
                          variant: isMobile ? 'caption' : 'body1'
                        }}
                      />
                    </ListItem>
                  ) : (
                    orderItems.map((item, idx) => {
                      const product = products.find((p: Product) => p.id === item.productId);
                      return (
                        <ListItem 
                          key={idx} 
                          sx={{ 
                            py: 2, 
                            borderBottom: '1px solid', 
                            borderColor: 'divider',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'flex-start' : 'center'
                          }}
                          secondaryAction={
                            <IconButton 
                              edge="end" 
                              color="error" 
                              onClick={() => handleRemoveItem(idx)}
                              sx={{ 
                                '&:hover': { backgroundColor: 'error.light' },
                                ...(isMobile && { position: 'absolute', right: 0, top: 16 })
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar sx={isMobile ? { mb: 1 } : {}}>
                            <Badge 
                              badgeContent={item.quantity} 
                              color="primary"
                              sx={{ 
                                '& .MuiBadge-badge': {
                                  right: -5,
                                  top: -5,
                                }
                              }}
                            >
                              <Avatar 
                                src={product?.image} 
                                alt={product?.name} 
                                sx={{ 
                                  width: isMobile ? 48 : 56, 
                                  height: isMobile ? 48 : 56 
                                }} 
                              />
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={product?.name}
                            primaryTypographyProps={{ 
                              fontWeight: 'medium',
                              variant: isMobile ? 'body1' : 'h6'
                            }}
                            secondary={
                              <Box>
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    display: 'block'
                                  }}
                                >
                                  {product?.description}
                                </Box>
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: isMobile ? '0.875rem' : '0.875rem',
                                    display: 'block'
                                  }}
                                >
                                  ₹{product?.price?.toFixed(2)}
                                </Box>
                              </Box>
                            }
                            sx={isMobile ? { mb: 1 } : {}}
                          />
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            ...(isMobile && { width: '100%', justifyContent: 'space-between', mt: 1 })
                          }}>
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={e => handleUpdateQuantity(idx, parseInt(e.target.value) || 1)}
                              inputProps={{ 
                                min: 1, 
                                max: product?.inventory || 1, 
                                style: { 
                                  width: isMobile ? 50 : 70, 
                                  textAlign: 'center' 
                                } 
                              }}
                              sx={{ 
                                mr: isMobile ? 1 : 2, 
                                '& .MuiOutlinedInput-root': { 
                                  borderRadius: 1,
                                  height: isMobile ? 32 : 40
                                }
                              }}
                            />
                            <Typography 
                              sx={{ 
                                minWidth: 80, 
                                textAlign: 'right', 
                                fontWeight: 'bold',
                                ...(isMobile && { fontSize: '0.875rem' })
                              }}
                            >
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        </ListItem>
                      );
                    })
                  )}
                </List>
              </Paper>
            </CardContent>
          </Card>
          
          {/* Payment Card */}
          <Card sx={{ 
            borderRadius: 2, 
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.background.paper
          }}>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.primary
                }}
              >
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Subtotal ({orderItems.length} items)</Typography>
                  <Typography variant="body2">₹{subtotal.toFixed(2)}</Typography>
                </Stack>
                
                <Stack 
                  direction={isMobile ? 'column' : 'row'} 
                  justifyContent="space-between" 
                  alignItems={isMobile ? 'flex-start' : 'center'} 
                  sx={{ mb: 1 }}
                  spacing={isMobile ? 1 : 0}
                >
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      ...(isMobile && { width: '100%' })
                    }}
                  >
                    <LocalOffer fontSize="small" sx={{ mr: 0.5 }} /> Discount
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    ...(isMobile && { width: '100%', justifyContent: 'space-between' })
                  }}>
                    <TextField
                      size="small"
                      type="number"
                      value={discountPercentage}
                      onChange={handleDiscountChange}
                      inputProps={{ 
                        min: 0, 
                        max: 100, 
                        step: 0.1, 
                        style: { 
                          width: isMobile ? 50 : 60, 
                          textAlign: 'right' 
                        } 
                      }}
                      sx={{ 
                        width: isMobile ? 100 : 120,
                        '& .MuiOutlinedInput-root': {
                          height: isMobile ? 32 : 40
                        }
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        sx: { borderRadius: 1 }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      color="error"
                      sx={{ ml: isMobile ? 0 : 2 }}
                    >
                      -₹{discountAmount.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Place fontSize="small" sx={{ mr: 0.5 }} /> Shipping
                  </Typography>
                  <Typography variant="body2">₹0.00</Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Estimated Tax</Typography>
                  <Typography variant="body2">Not calculated</Typography>
                </Stack>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ₹{total.toFixed(2)}
                </Typography>
              </Stack>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleOpenInvoiceModal}
                disabled={orderItems.length === 0}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 1, 
                  fontWeight: 'bold',
                  '&:hover': { boxShadow: 2 },
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                Create Invoice
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            mb: isMobile ? 2 : 3, 
            borderRadius: 2, 
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.background.paper
          }}>
            <CardContent>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 1,
                  color: theme.palette.text.primary
                }}
              >
                Order Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Notes
                </Typography>
                <TextField
                  multiline
                  minRows={3}
                  fullWidth
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add order notes..."
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 1,
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Customer
                </Typography>
                <TextField
                  fullWidth
                  value={customer}
                  onChange={e => setCustomer(e.target.value)}
                  placeholder="Search or create a customer"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Market
                </Typography>
                <TextField
                  fullWidth
                  value={market}
                  onChange={e => setMarket(e.target.value)}
                  placeholder="Select market"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Place color="action" />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Tags
                </Typography>
                <TextField
                  fullWidth
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="Add tags (comma separated)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalOffer color="action" />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
                {tags && (
                  <Box sx={{ mt: 1 }}>
                    {tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag.trim()} 
                        size="small" 
                        sx={{ 
                          mr: 1, 
                          mb: 1,
                          backgroundColor: theme.palette.mode === 'light' ? 
                            theme.palette.grey[200] : 
                            theme.palette.grey[700]
                        }} 
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Invoice Modal */}
      <Dialog 
        open={invoiceModalOpen} 
        onClose={handleCloseInvoiceModal} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Create Invoice</DialogTitle>
        <DialogContent>
          <TextField
            label="To"
            type="email"
            required
            fullWidth
            margin="normal"
            value={toEmail}
            onChange={e => setToEmail(e.target.value)}
            error={!!toEmail && !validateEmail(toEmail)}
            helperText={toEmail && !validateEmail(toEmail) ? 'Enter a valid email address' : ''}
            sx={{ mt: 2 }}
          />
          <TextField
            label="CC"
            fullWidth
            margin="normal"
            value={ccEmail}
            onChange={e => setCcEmail(e.target.value)}
            placeholder="Comma separated emails (optional)"
          />
          <TextField
            label="BCC"
            fullWidth
            margin="normal"
            value={bccEmail}
            onChange={e => setBccEmail(e.target.value)}
            placeholder="Comma separated emails (optional)"
          />
          <TextField
            label="Message"
            fullWidth
            margin="normal"
            multiline
            minRows={isMobile ? 2 : 3}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Optional message"
          />
          {sendSuccess && (
            <Typography 
              color="success.main" 
              sx={{ 
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Invoice sent successfully!
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseInvoiceModal} 
            disabled={sendLoading}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendInvoice}
            disabled={!validateEmail(toEmail) || sendLoading}
          >
            {sendLoading ? 'Sending...' : 'Send Invoice'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Product Selection Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Select Products</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            placeholder="Search products..."
            fullWidth
            variant="outlined"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 1,
                backgroundColor: theme.palette.background.default
              }
            }}
            sx={{ mt: 1 }}
          />
          <Box sx={{ 
            mt: 2, 
            maxHeight: isMobile ? 'calc(100vh - 200px)' : 400, 
            overflow: 'auto',
            pb: isMobile ? 2 : 0
          }}>
            {filteredProducts.length === 0 ? (
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  textAlign: 'center', 
                  py: 4 
                }}
              >
                No products found
              </Typography>
            ) : (
              filteredProducts.map((product) => (
                <Paper 
                  key={product.id} 
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    cursor: 'pointer', 
                    '&:hover': { 
                      bgcolor: theme.palette.action.hover 
                    },
                    backgroundColor: theme.palette.background.paper
                  }}
                >
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={2}
                    sx={isMobile ? { flexDirection: 'column', alignItems: 'flex-start' } : {}}
                  >
                    <Avatar 
                      src={product.image} 
                      sx={{ 
                        width: isMobile ? 64 : 48, 
                        height: isMobile ? 64 : 48 
                      }} 
                    />
                    <Box sx={{ 
                      flexGrow: 1,
                      ...(isMobile && { width: '100%' })
                    }}>
                      <Typography fontWeight="medium">{product.name}</Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={isMobile ? { mt: 0.5 } : {}}
                      >
                        {product.description}
                      </Typography>
                      <Typography 
                        fontWeight="bold" 
                        sx={isMobile ? { mt: 1 } : {}}
                      >
                        ₹{product.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      size={isMobile ? 'medium' : 'small'}
                      onClick={() => {
                        setSelectedProduct(product.id);
                        setModalOpen(false);
                      }}
                      sx={isMobile ? { width: '100%', mt: 1 } : {}}
                    >
                      Add
                    </Button>
                  </Stack>
                </Paper>
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setModalOpen(false)}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewOrder;