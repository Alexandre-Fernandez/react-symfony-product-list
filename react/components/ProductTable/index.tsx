import { fetchedProduct } from "../../pages/Products"
import ProductRow from "../ProductRow"
import ProductTableFooter from "../ProductTableFooter"

interface ProductTableProps {
	products: fetchedProduct[]
	fetchProducts: () => void
}
const ProductTable: React.FC<ProductTableProps> = ({products, fetchProducts}) => {
	return <table className="product-table">
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
			</tr>
		</thead>
		<tbody>
			{
				products.length > 0 && products.map((product, i) => <ProductRow 
					key={product.id}
					id={product.id} 
					productName={product.name}
					productGrossPrice={product.grossPrice} 
					productVat={product.vat} 
					productPrice={product.price} 
					createdAt={String(product.createdAt.date.match(/[^.]+/))}
					fetchProducts={fetchProducts}
				/>)
			}
		</tbody>
		<ProductTableFooter fetchProducts={fetchProducts}/>
	</table>
}

export default ProductTable