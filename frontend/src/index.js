import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { Provider } from "mobx-react";
import * as serviceWorker from './serviceWorker';
import stores from './store';

ReactDOM.render(<Provider stores={stores}><App /></Provider>, document.getElementById('root'));

serviceWorker.unregister();
