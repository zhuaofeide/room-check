import React from 'react';
import ReactDOM from 'react-dom';
// import { Router, Route, hashHistory } from 'react-router';
import {BrowserRouter, Route} from 'react-router-dom';
import Login from './components/login';
import Home from './components/home';
import Speech from './components/speech';
import Detail from './components/detail';
import Record from './components/record';
import reducers from './reducer';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import AuthRouter from '../src/components/Authrouter/Authrouter'
import registerServiceWorker from './registerServiceWorker';
const store = createStore(reducers, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
));
ReactDOM.render(
    (<Provider store={store}>
        <BrowserRouter>
            <div className="wrapper">
                    <AuthRouter/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/home" component={Home}/>
                    <Route path="/speech" component={Speech}/>
                    <Route path="/detail" component={Detail}/>
                    <Route path="/record" component={Record}/>
            </div>
        </BrowserRouter>
    </Provider>),
    document.getElementById('root')
);
registerServiceWorker();
