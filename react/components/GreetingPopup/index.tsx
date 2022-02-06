interface GreetingPopupProps {
	message: string
}
const GreetingPopup: React.FC<GreetingPopupProps> = ({message}) => {
	return <div className="greeting-popup">
		<strong>{message}</strong>
	</div>
}

export default GreetingPopup