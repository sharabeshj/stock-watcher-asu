import './App.css';
import {StoreProvider} from './Store';
import AddStock from './components/AddStock';
import ListStock from './components/ListStock';
import { createTheme, Theme, ThemeProvider } from '@mui/material';
import { Layout } from './components/Layout';

export const theme: Theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
      light: '#6fbf73',
      dark: '#6fbf73',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ffea00',
      light: '#ffee33',
      dark: '#b2a300'
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StoreProvider>
        <Layout>
          <AddStock />
          <ListStock />
        </Layout>
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
