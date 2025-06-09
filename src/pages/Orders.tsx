import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  Chip,
  Grid,
  Typography,
  Tabs,
  Tab,
  InputAdornment,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { RootState } from '../store';
import type { Order, Product } from '../types';
import { useState } from 'react';

const paymentStatusColor = {
  paid: 'success',
  'payment pending': 'warning',
};
const fulfillmentStatusColor = {
  fulfilled: 'success',
  unfulfilled: 'warning',
};
const deliveryStatusColor = {
  delivered: 'success',
  'in transit': 'info',
  'out for delivery': 'info',
  'attempted delivery': 'warning',
};

const Orders = () => {
  const orders = useSelector((state: RootState) => state.orders.items);
  const products = useSelector((state: RootState) => state.products.items);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');

  // Dummy filter tabs
  const filterTabs = [
    { label: 'All' },
    { label: 'Unfulfilled' },
    { label: 'Unpaid' },
    { label: 'Open' },
    { label: 'Archived' },
    { label: 'Return requests' },
  ];

  // Dummy status for demo
  const getPaymentStatus = (order: Order) => (order.status === 'pending' ? 'Payment pending' : 'Paid');
  const getFulfillmentStatus = (order: Order) => (order.status === 'completed' ? 'Fulfilled' : 'Unfulfilled');
  const getDeliveryStatus = (order: Order) => {
    if (order.status === 'completed') return 'Delivered';
    if (order.status === 'processing') return 'In transit';
    if (order.status === 'cancelled') return 'Attempted delivery';
    return 'Out for delivery';
  };

  // Filtered orders (search by customer or order id)
  const filteredOrders = orders.filter(order => {
    const customer = 'Customer'; // Placeholder, add customer field if needed
    return (
      order.id.includes(search) ||
      customer.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Orders</Typography>
      <Card sx={{ mb: 2, p: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ minHeight: 36 }}
            >
              {filterTabs.map((t, i) => (
                <Tab key={t.label} label={t.label} sx={{ minHeight: 36, textTransform: 'none' }} />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              placeholder="Search orders"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </Card>
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment status</TableCell>
                <TableCell>Fulfillment status</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Delivery status</TableCell>
                <TableCell>Delivery method</TableCell>
                <TableCell>Tags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, idx) => (
                <TableRow key={order.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>#{order.id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Online Store</TableCell>
                  <TableCell>₹{order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={getPaymentStatus(order)}
                      color={getPaymentStatus(order) === 'Paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getFulfillmentStatus(order)}
                      color={getFulfillmentStatus(order) === 'Fulfilled' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getDeliveryStatus(order)}
                      color={
                        getDeliveryStatus(order) === 'Delivered'
                          ? 'success'
                          : getDeliveryStatus(order) === 'In transit'
                          ? 'info'
                          : getDeliveryStatus(order) === 'Attempted delivery'
                          ? 'warning'
                          : 'info'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>Free Shipping</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Chip label="cod_confirmation" size="small" />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Orders; 