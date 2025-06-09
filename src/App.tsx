import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';
import Layout from './components/Layout';
import Orders from './pages/Orders';
import NewOrder from './pages/NewOrder';
import Products from './pages/Products';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/orders" element={<Orders />} />
              <Route path="/new-order" element={<NewOrder />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
