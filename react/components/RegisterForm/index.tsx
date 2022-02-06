import config from "../../config"
import { useContext, useEffect, useRef, useState } from "react"
import { ContentType, createFetchRequest, HttpMethod, useFetch, useFetchRequest } from "../../hooks/useFetch"
import { AuthContext } from "../../context/AuthContext"
import { GreetingContext } from "../../context/GreetingContext"

const RegisterForm: React.FC = () => {
	const {login} = useContext(AuthContext)
	const {triggerGreeting} = useContext(GreetingContext)
	const [fetchRequest, setFetchRequest] = useFetchRequest(createFetchRequest())
	const {data, error} = useFetch(fetchRequest)
	const usernameRef = useRef<HTMLInputElement>(null)
	const emailRef = useRef<HTMLInputElement>(null)
	const passwordRef = useRef<HTMLInputElement>(null)
	const passwordConfirmationRef = useRef<HTMLInputElement>(null)

	const [isPasswordConfirmed, setIsPasswordConfirmed] = useState<boolean|null>(null)

	const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const password = passwordRef.current?.value
		const passwordConfirmation = passwordConfirmationRef.current?.value
		if(password && password === passwordConfirmation) setIsPasswordConfirmed(true)
		else return setIsPasswordConfirmed(false)
		setFetchRequest(config.api.register, HttpMethod.POST, null, {
			name: usernameRef.current?.value,
			email: emailRef.current?.value,
			password: password
		}, ContentType.FORM_DATA)
	}

	useEffect(() => {
		if(data) {
			login(data.payload.username, data.payload.jwt)
			triggerGreeting(data.message)
		}
	}, [data])

	return <div className="register form-container">
		<h2 className="register__heading">Register</h2>
		<form className="register__form form" onSubmit={handleSubmit}>
		{
			isPasswordConfirmed !== null && !isPasswordConfirmed && 
			<ul className="form__error-list error-list">
				<li className="error-list__error">Please confirm your password</li>
			</ul>
		}
		{
			isPasswordConfirmed && error && 
			<ul className="form__error-list error-list">
				{Object.values(error).map((err, i) => 
					<li className="error-list__error" key={i}>
						{err as string}
					</li>
				)}
			</ul>
		}
		<label htmlFor="name" className="form__label">Username</label>
			<input 
				ref={usernameRef}
				type="text" 
				name="name" 
				placeholder="Choose an username" 
				id="name" 
				className="form__input" 
				autoFocus
			/>
			<label htmlFor="email" className="form__label">E-mail</label>
			<input 
				ref={emailRef}
				type="email" 
				name="email" 
				placeholder="Enter your e-mail" 
				id="email" 
				className="form__input" 
			/>
			<label htmlFor="password" className="form__label">Password</label>
			<input 
				ref={passwordRef}
				type="password" 
				name="password" 
				placeholder="Choose a password"
				id="password" 
				className="form__input" 
			/>
			<label htmlFor="password-confirm" className="form__label">Password confirmation</label>
			<input 
				ref={passwordConfirmationRef}
				type="password" 
				name="password-confirm" 
				placeholder="Confirm your password"
				id="password-confirm" 
				className="form__input" 
			/>
			<button type="submit" className="form__submit">Register</button>
		</form>
	</div>
}

export default RegisterForm