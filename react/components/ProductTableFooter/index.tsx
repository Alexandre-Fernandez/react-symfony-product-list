import { useContext, useEffect, useState } from "react"
import config from "../../config"
import { AuthContext } from "../../context/AuthContext"
import { ContentType, createFetchRequest, HttpMethod, useFetch, useFetchRequest } from "../../hooks/useFetch"
interface ProductTableFooterProps {
	fetchProducts: () => void
}
const ProductTableFooter: React.FC<ProductTableFooterProps> = ({fetchProducts}) => {
	const {user} = useContext(AuthContext)
	const [fetchRequest, setFetchRequest] = useFetchRequest(createFetchRequest())
	const {data} = useFetch(fetchRequest)
	const [name, setName] = useState("")
	const [price, setPrice] = useState("0")

	const handleCreate = () => {
		setFetchRequest(
			config.api.products, 
			HttpMethod.POST, user?.jwt.token, 
			{name, price},
			ContentType.FORM_DATA
		)
	}

	useEffect(() => {
		if(data) fetchProducts()
	}, [data])

	return <tfoot className="product-table__footer">
		<tr className="product-table__row">
				<th className="product-table__column" colSpan={6}></th>
				<th className="product-table__column" colSpan={2}>ADD</th>
		</tr>
		<tr className="product-table__row">
		<td className="product-row__column">{data?.id}</td>
		<td className="product-row__column">
			<input 
				value={name}
				onChange={e => setName(e.target.value)}
				type="text"
				name="name"
			/>
		</td>
		<td className="product-row__column"><span>{data?.grossPrice}</span></td>
		<td className="product-row__column"><span>{data?.vat}</span></td>
		<td className="product-row__column">
			<input 
				value={price}
				onChange={e => setPrice(e.target.value)}
				type="number" 
				name="price"
			/>
		</td>
		<td className="product-row__column">{data?.createdAt.date.match(/[^.]+/)}</td>
		<td className="product-row__column" colSpan={2}>
			<button 
				onClick={handleCreate}
				className="product-row__button"
			>
				<i className="fas fa-plus"></i>
			</button>
		</td>
		</tr>
	</tfoot>
}

export default ProductTableFooter

/*
		<thead className="product-table__head">
			<tr className="product-table__row">
				<th className="product-table__column">ID</th>
				<th className="product-table__column">NAME</th>
				<th className="product-table__column">GROSS</th>
				<th className="product-table__column">VAT</th>
				<th className="product-table__column">PRICE</th>
				<th className="product-table__column">CREATION DATE</th>
				<th className="product-table__column">EDIT</th>
				<th className="product-table__column">DELETE</th>

<tr className="product-row">
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
				onChange={e => setPrice(e.target.value)}
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
*/