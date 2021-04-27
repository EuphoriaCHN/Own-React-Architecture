import * as React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';

// import 'normalize.css';
import '@common/styles/base.scss';

import App from './App';

const HotApp = hot(module)(App);

ReactDOM.render(React.createElement(HotApp), document.getElementById('root'));