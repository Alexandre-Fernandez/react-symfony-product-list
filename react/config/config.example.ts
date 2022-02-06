const dev = {}

const prod = {}

const config = process.env.NODE_ENV === "development" ? dev : prod

export default config