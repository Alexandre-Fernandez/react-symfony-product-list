interface ErrorListProps {
	error1?: string | string[]
	error2?: string | string[]
}
const ErrorList: React.FC<ErrorListProps> = ({error1 = [], error2 = []}) => {
	if(error1.constructor !== Array ) error1= [error1 as string]
	if(error2.constructor !== Array ) error2= [error2 as string]
	const errors = [...error1, ...error2]
	return <div className="error-list">
		{
			errors.map((error, i) => typeof error === "string" 
				? <li 
					key={i}
					className="error-list__error"
				> {error} </li>
				: null
			)
		}
	</div>
}

export default ErrorList