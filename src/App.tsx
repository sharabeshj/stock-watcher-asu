import './App.css';
import {StoreProvider} from './Store';
import AddStock from './components/AddStock';
import ListStock from './components/ListStock';

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <header className="App-header">
          Stock Watcher
        </header>
        <AddStock />
        <ListStock />
      </div>
    </StoreProvider>
  );
}

export default App;
