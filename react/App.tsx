import "./styles/main.scss"
import React, { useEffect, useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext, User } from "./context/AuthContext"
import { GreetingContext } from "./context/GreetingContext"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Products from "./pages/Products"
import GreetingPopup from "./components/GreetingPopup"

const App: React.FC = () => {
	const {user, login, logout} = useContext(AuthContext)
	const {greetingMessage, triggerGreeting} = useContext(GreetingContext)

	useEffect(() => { // gets previous session if it's still valid
		const usr = JSON.parse(localStorage.getItem("user") ?? "{}")
		if(!usr.jwt) return
		if(Date.now() >= usr.jwt.expiration * 1000) return logout()
		login(usr.name, usr.jwt)
		triggerGreeting(`Welcome ${usr.name} !`)
	}, [])

	return <>
		<Routes>
			<Route path="/" element={
				user ? <Navigate to="/products"/> : <MainLayout><Home/></MainLayout>
			}></Route>
			<Route path="/register" element={
				user ? <Navigate to="/products"/> : <MainLayout><Register/></MainLayout>
			}></Route>
			<Route path="/products" element={
				!user ? <Navigate to="/"/> : <MainLayout><Products/></MainLayout>
			}></Route>
		</Routes>
		{
			greetingMessage && <GreetingPopup message={greetingMessage}/>
		}
	</>
}

export default App