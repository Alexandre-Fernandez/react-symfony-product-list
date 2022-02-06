const prodHost = "docker"

type configuration = {
	api: {
		register: string,
		login: string,
		products: string
	}
}

const dev: configuration = {
	api: {
		register: "/register",
		login: "/api/login_check",
		products: "/api/product",
	}
}

const prod: configuration = {
	api: {
		register: `${prodHost}/register`,
		login: `${prodHost}/api/login_check`,
		products: `${prodHost}/api/product`
	}
}

const config: configuration = process.env.NODE_ENV === "development" ? dev : prod

export default config