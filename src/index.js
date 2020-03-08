import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// import jwtDecode from 'jwt-decode';
import axios from 'axios';
import AppRouter from "./routers/AppRouter";
import configureStore from './store/configureStore'
// import Loader from './components/Loader';
import { login, startLogout } from './actions/auth';
import { history } from './routers/AppRouter';

import 'animate.css';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app



const store = configureStore();


// where we defined all our routes and its associated components. we wrapped it inside the Provider to have access to redux
const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

let hasRendered = false;

const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('root'));
    hasRendered = true;
  }
};

// ReactDOM.render(<Loader />, document.getElementById('root'));


const token = localStorage.getItem('token');
//checks if the token is there. if it is there then check its expiery and if its expired then logout
if (token) {
  const decodedToken = token;
  console.log('decoded', decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(startLogout());
    renderApp();
    history.push('/login');
  }
  else {
    axios.defaults.headers.common['x-access-token'] = token;
    
    store.dispatch(login());  // if the token is there then we again repeat the same steps that we do after login or register
    if (history.location.pathname === '/') {
      history.push('/dashboard');
      
    }
    renderApp();
  }
} else {
  renderApp();
}
