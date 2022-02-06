interface PaginationProps {
	isLastPage: boolean,
	page: number,
	setPage: (input: number) => void
}
const Pagination: React.FC<PaginationProps> = ({isLastPage, page, setPage}) => {
	const handleClick = (count: number) => {
		if(isLastPage && count > 0) return
		if(page === 0 && count < 0) return
		setPage(page + count)
	}

	return <div className="pagination">
		<button 
			onClick={() => handleClick(-1)}
			className="pagination__button prev"
		>
			<i className="fas fa-arrow-left"></i>
		</button>
		<strong>{page + 1}</strong>
		<button 
			onClick={() => handleClick(1)}
			className="pagination__button next"
			>
			<i className="fas fa-arrow-right"></i>
		</button>
	</div>
}

export default Pagination