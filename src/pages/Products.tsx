import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import type { RootState } from '../store';
import type { Product } from '../types';

const Products = () => {
  const products = useSelector((state: RootState) => state.products.items);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Products Inventory
      </Typography>
      <Grid container spacing={3}>
        {products.map((product: Product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={product.inventory > 0 ? 'success.main' : 'error.main'}
                  >
                    {product.inventory > 0
                      ? `${product.inventory} in stock`
                      : 'Out of stock'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Products; 