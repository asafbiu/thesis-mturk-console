import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const id = document.getElementById('root').getAttribute('data-id');
const context = document.getElementById('root').getAttribute('data-context');
const intents = document.getElementById('root').getAttribute('data-intents').split("|").map(intent => intent.trim());
const icons = document.getElementById('root').getAttribute('data-icons').split("|").map(icon => icon.trim());
const instructions = document.getElementById('root').getAttribute('data-instructions');

console.log("context", document.getElementById('root').getAttribute('data-context'))
console.log("intents", document.getElementById('root').getAttribute('data-intents'))
console.log("icons", document.getElementById('root').getAttribute('data-icons'))

ReactDOM.render(
  <React.StrictMode>
    <App id={id} context={context} intents={intents} icons={icons} instructions={instructions} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
