import { useContext, useEffect, useState } from "react"
import config from "../../config"
import { AuthContext } from "../../context/AuthContext"
import { ContentType, createFetchRequest, HttpMethod, useFetch, useFetchRequest } from "../../hooks/useFetch"

const digits = new Set("1234567890.")

type Product = {
	id: number,
	productName: string,
	productGrossPrice: number,
	productVat: number,
	productPrice: number,
	createdAt: string
}
interface ProductRowProps extends Product{
	fetchProducts: () => void
}
const ProductRow: React.FC<ProductRowProps> = ({id, productName, productGrossPrice, productVat, productPrice, createdAt, fetchProducts}) => {
	const {user} = useContext(AuthContext)
	const [fetchRequest, setFetchRequest] = useFetchRequest(createFetchRequest())
	const {data} = useFetch(fetchRequest)
	const [name, setName] = useState(productName)
	const [price, setPrice] = useState(productPrice.toString())
	const [grossPrice, setGrossPrice] = useState(productGrossPrice)
	const [vat, setVat] = useState(productVat)

	const handleUpdate = () => {
		setFetchRequest(
			config.api.products + `/${id}`, 
			HttpMethod.PUT, user?.jwt.token, 
			{name, price},
			ContentType.JSON
		)
	}

	const handleDelete = () => {
		setFetchRequest(
			config.api.products + `/${id}`, 
			HttpMethod.DELETE, user?.jwt.token
		)
	}

	const handlePriceChange = (digit: string) => {
		if(!digits.has(digit)) return
	}

	useEffect(() => {
		if(data === -1) fetchProducts()
		else if(data) {
			setGrossPrice(data.grossPrice)
			setVat(data.vat)
		}
	}, [data])

	return <tr className="product-row">
		<td className="product-row__column">{id}</td>
		<td className="product-row__column">
			<input 
				value={name}
				onChange={e => setName(e.target.value)}
				type="text"
				name="name"
			/>
		</td>
		<td className="product-row__column"><span>{grossPrice}</span></td>
		<td className="product-row__column"><span>{vat}</span></td>
		<td className="product-row__column">
			<input 
				value={price}
				onChange={e => handlePriceChange(e.target.value)}
				type="number" 
				name="price"
			/>
		</td>
		<td className="product-row__column">{createdAt}</td>
		<td className="product-row__column">
			<button 
				onClick={handleUpdate}
				className="product-row__button"
			>
				<i className="fas fa-cog"></i>
			</button>
		</td>
		<td className="product-row__column">
			<button 
				onClick={handleDelete}
				className="product-row__button"
			>
				<i className="fas fa-trash"></i>
			</button>
		</td>

	</tr>
}

export default ProductRow