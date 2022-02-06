import { createContext, useState } from "react"

const GREETING_DURATION = 3000

type Greeting = {
	greetingMessage: string,
	triggerGreeting: (message: string) => void
}

export const GreetingContext = createContext<Greeting>({
	greetingMessage: "",
	triggerGreeting: () => {}
})

const useGreeting = () => {
	const [greetingMessage, setGreetingMessage] = useState("")

	const triggerGreeting = (message: string = "") => {
		setGreetingMessage(message)
		setTimeout(() => setGreetingMessage(""), GREETING_DURATION)
	}

	return {greetingMessage, triggerGreeting}
}

export const GreetingProvider: React.FC = ({children}) => {
	return <GreetingContext.Provider value={useGreeting()}>
		{children}
	</GreetingContext.Provider>
}