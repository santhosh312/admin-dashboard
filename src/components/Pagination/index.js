import {BiLastPage, BiFirstPage, BiChevronLeft, BiChevronRight} from 'react-icons/bi'
import './index.css'

const Pagination = (props) => {
    const {numberOfButtons, activePage, setActivePage, deleteSelectedUsers} = props
    
    const navigateToFirstPage = () => {
        setActivePage(1)
    }

    const navigateToLastPage = () => {
        setActivePage(numberOfButtons)
    }

    const navigateToNextPage = () => {
        let value = (activePage===numberOfButtons)?numberOfButtons:activePage+1;
        setActivePage(value)
    }

    const navigateToPreviousPage = () => {
        let value = (activePage===1)?activePage:activePage-1
        setActivePage(value)
    }

    const navigateToPage = (value) => {
        setActivePage(value)
    }

    let buttonsArray = []
    for (let i=1;i<=numberOfButtons;i++){
        buttonsArray.push(i)
    }

    return(
        <ul className="pagination-container">
            <li className='buttons-container'>
            <button onClick={navigateToFirstPage}><BiFirstPage className="icon" /></button>
            <button onClick={navigateToPreviousPage}><BiChevronLeft className="icon" /></button>
            {buttonsArray.map(item => (
                <button onClick={()=>navigateToPage(item)} 
                        className={`pagination-button ${activePage===item&&'active'}`} 
                        value={item} 
                        key={item}>
                    {item}
                </button>
            ))}
            <button onClick={navigateToNextPage}><BiChevronRight className="icon" /></button>
            <button onClick={navigateToLastPage}><BiLastPage className="icon" /></button>
            </li>
            <li>
                <button onClick={deleteSelectedUsers} className='delete-button'>Delete Selected</button>
            </li>
        </ul>
    )
}

export default Pagination