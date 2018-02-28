import React, { Component } from 'react';
import { store } from './redux/store';
import {Provider} from 'react-redux'
import Container from './Container'
import Header from './components/Header'
import { persistStore } from 'redux-persist'

class App extends Component{

  render() {
    console.log(store)
    let persistor = persistStore(store)
    return(
      <Provider store={store} persistor={persistor}>
        <div>
          <Header />
          <Container/>
        </div>
      </Provider>
    )
  }
}

export default App
