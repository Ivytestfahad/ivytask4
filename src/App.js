import React from 'react';
import { Provider } from 'react-redux'; 
import store from './redux/store';
import Table from './components/Table';


function App() {
  return (
    <Provider store={store}>
       <div className="App">
      <Table /> {/* Add the Table component here */}
    </div>
    </Provider>
  );
}

export default App;
