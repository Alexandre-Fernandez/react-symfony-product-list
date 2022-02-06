import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { GreetingProvider } from "./context/GreetingContext"

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<GreetingProvider>
				<Router><App/></Router>
			</GreetingProvider>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
)