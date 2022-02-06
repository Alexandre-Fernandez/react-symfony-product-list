import {createContext, useState} from "react"

type Jwt = {
	token: string,
	expiration: number
}

export type User = {
	name: string,
	jwt: Jwt
} | null

type Auth = {
	user: User,
	login: (username: string, jwt: Jwt) => void,
	logout: () => void
}

const useAuth = (initialUser: User = null): Auth => {
	const [user, setUser] = useState<User>(initialUser)

	const login = (username: string, jwt: Jwt) => {
		const usr = {name: username, jwt}
		localStorage.setItem("user", JSON.stringify(usr))
		setUser(usr)
	}

	const logout = () => {
		localStorage.removeItem("user")
		setUser(null)
	}
	
	return {user, login, logout}
}

export const AuthContext = createContext<Auth>({
	user: null,
	login: () => {},
	logout: () => {}
})

export const AuthProvider: React.FC<{initialUser?: User}> = ({initialUser = null, children }) => {
	return <AuthContext.Provider value={useAuth(initialUser)}>
		{children}
	</AuthContext.Provider>
}