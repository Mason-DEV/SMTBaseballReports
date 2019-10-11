import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/stable';
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
// in index.js
import packageJson from '../package.json';
console.log("Build version",packageJson.version); // "1.0.0"

ReactDOM.render(<App />,	document.getElementById("root")
);
registerServiceWorker();
