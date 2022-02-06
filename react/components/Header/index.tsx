import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Link } from "react-router-dom"

const Header: React.FC = () => {
	const {user, logout} = useContext(AuthContext)

	return <header className="header">
		<div className="header__content">
			<h1 className="header__heading">PRODUCT LIST</h1>
			<nav className="header__nav">
				<ul className="header__list">
					{
						user 
						? <>
							<li className="header__item">
								<Link to="/products" className="header__link">Products</Link>
							</li>
							<li className="header__item">
								<Link to="/" onClick={logout} className="header__link">Logout</Link>
							</li>
						</>
						: <>
							<li className="header__item">
								<Link to="/" className="header__link">Login</Link>
							</li>
							<li className="header__item">
								<Link to="/register" className="header__link">Register</Link>
							</li>
						</>
					}
				</ul>
			</nav>
		</div>
	</header>
}

export default Header