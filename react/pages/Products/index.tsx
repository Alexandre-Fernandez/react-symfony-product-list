import { useContext, useEffect, useState } from "react"
import {useFetch, createFetchRequest, useFetchRequest, HttpMethod } from "../../hooks/useFetch"
import ProductTable from "../../components/ProductTable"
import SearchBar from "../../components/SearchBar"
import { AuthContext } from "../../context/AuthContext"
import config from "../../config"
import Pagination from "../../components/Pagination"

export type fetchedProduct = {
	id: number,
	name: string,
	vat: number,
	grossPrice: number,
	price: number,
	createdAt: {
		date: string, // 2022-02-04 11:58:29.000000
		timezone_type: number, // 3
		timezone: string // UTC
	}
}

type fetchedProducts = {
	isLastPage: boolean,
	results: fetchedProduct[]
}

const Products: React.FC = () => {
	const {user} = useContext(AuthContext)
	const [fetchRequest, setFetchRequest] = useFetchRequest(createFetchRequest())
	const {data, error} = useFetch<fetchedProducts>(fetchRequest)
	const [search, setSearch] = useState("")
	const [page, setPage] = useState(0)
	const [isLastPage, setIsLastPage] = useState(true)
	const [reFetch, setReFetch] = useState({})

	useEffect(() => {
		setFetchRequest(config.api.products, HttpMethod.GET, user?.jwt.token)
	}, [])

	useEffect(() => {
		const p = `?p=${page}`
		const q = search ? `&q=${search}` : ""
		setFetchRequest(config.api.products + p + q, HttpMethod.GET, user?.jwt.token)
	}, [search, page, reFetch])

	useEffect(() => {
		if(data !== -1 && data?.isLastPage != null) setIsLastPage(data.isLastPage)
	}, [data])

	return <main className="products">
		<SearchBar search={search} setSearch={setSearch}/>
		<ProductTable products={data !== -1 ? (data?.results ?? []) : []} fetchProducts={() => setReFetch({})/* setReFetch({}) */}/> 
		<Pagination page={page} setPage={setPage} isLastPage={isLastPage}/>
	</main>
}

export default Products