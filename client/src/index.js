import "react-app-polyfill/ie9"; // For IE 9-11 support
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { unregister } from "./registerServiceWorker";

unregister();
ReactDOM.render(
		<App />,
	document.getElementById("root")
);