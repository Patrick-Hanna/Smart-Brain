import React from 'react';
//import createRoot from 'react-dom/client';
import './index.css';
import App from './App';
import 'tachyons';

// import registerServiceWorker from './registerserviceworker';
// const root = createRoot(container);


// root.render (<App/>, document.getElementById('root'));


// registerServiceWorker();


import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab = 'home' />);