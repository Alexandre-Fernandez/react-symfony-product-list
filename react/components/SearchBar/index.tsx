interface SearchBarProps {
	search: string,
	setSearch: (input: string) => void
}
const SearchBar: React.FC<SearchBarProps> = ({search, setSearch}) => {
	return <div className="search-bar">
		<label htmlFor="search">Search for a product:</label>
		<input 
			value={search}
			onChange={e => setSearch(e.target.value)}
			type="text" 
			className="search-bar__input"
			id="search"
		/>
	</div>
}

export default SearchBar