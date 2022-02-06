import config from "../../config"
import { useContext, useEffect, useRef } from "react"
import { ContentType, createFetchRequest, HttpMethod, useFetch, useFetchRequest } from "../../hooks/useFetch"
import { AuthContext } from "../../context/AuthContext"
import { GreetingContext } from "../../context/GreetingContext"
import ErrorList from "../ErrorList"

const LoginForm: React.FC = () => {
	const {login} = useContext(AuthContext)
	const {triggerGreeting} = useContext(GreetingContext)
	const [fetchRequest, setFetchRequest] = useFetchRequest(createFetchRequest())
	const {data, error} = useFetch(fetchRequest)
	const emailRef = useRef<HTMLInputElement>(null)
	const passwordRef = useRef<HTMLInputElement>(null)

	const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setFetchRequest(config.api.login, HttpMethod.POST, null, {
			username: emailRef.current?.value,
			password: passwordRef.current?.value
		}, ContentType.JSON)
	}

	useEffect(() => {
		if(data) {
			login(data.payload.username, data.payload.jwt)
			triggerGreeting(data.message)
		}
	}, [data])

	return <div className="login form-container">
		<h2 className="login__heading">Login</h2>
		<form className="login__form form" onSubmit={handleSubmit}>
			{error && <ErrorList error1={error.message}/>}
			<label htmlFor="email" className="form__label">E-mail</label>
			<input 
				ref={emailRef}
				type="email" 
				name="email" 
				placeholder="Enter your e-mail" 
				id="email" 
				className="form__input" 
				autoFocus
			/>
			<label htmlFor="password" className="form__label">Password</label>
			<input 
				ref={passwordRef}
				type="password" 
				name="password" 
				placeholder="Enter your password"
				id="password" 
				className="form__input" 
			/>
			<button type="submit" className="form__submit">Connect</button>
		</form>
	</div>
}

export default LoginForm

/*
					{error.map((err: string) => <li className="error-list__error">
						{err}
					</li>)}
*/