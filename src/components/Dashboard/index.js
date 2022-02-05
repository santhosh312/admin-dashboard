import {Component} from 'react'

import {BsSearch} from 'react-icons/bs'
import {ThreeDots} from 'react-loader-spinner'

import TableRow from '../TableRow'
import Pagination from '../Pagination'

import './index.css'

const noOfResultsPerPage = 10;
const initialActivePage = 1;

const loadingStatus = {
    initial:'INITIAL',
    loading:'LOADING',
    success:'SUCCESS',
    failure:'FAILURE',
}

class Dashboard extends Component{
    state = {usersInformation:[], isLoading:loadingStatus.initial, activePage:initialActivePage, searchKey:'', selectedUserIds:[]}

    // Calls the function to get user Data on component mount
    componentDidMount(){
        this.getUserData()
    }

    renderSearchBar = () => (
        <form onSubmit={this.searchByFilters} className='input-container'>
            <input placeholder='Search by name, role or email and press ENTER' id='searchInput' type="search" />
            <BsSearch className='search-icon' />
        </form>
    )

    renderTable = (pageinateResults, numberOfButtons, selectedUserIds, activePage) => (
        <>
            <div className='table-wrapper'>
                <ul className='table-container'>
                    {this.renderTableHeader(pageinateResults)}
                    {pageinateResults.length===0 && <p className='empty-table'>No users to show</p>}
                    {pageinateResults.map(item => <TableRow addOrRemoveSelectedRow={this.addOrRemoveSelectedRow} isChecked={selectedUserIds.includes(item.id)} deleteUserFromInitialList={this.deleteUserFromInitialList} key={item.id} userDetails={item} editUserDetails={this.editUserDetails} />)}
                </ul>
            </div>
            <Pagination setActivePage={this.setActivePage} numberOfButtons={numberOfButtons} activePage={activePage} deleteSelectedUsers={this.deleteSelectedUsers} />
        </>
    )

    //Function that renders the table header
    renderTableHeader = (pageResults) => (
        <li className='table-header'>
            <div className='select-all-box'>
                <input id='selectAll' onChange={(e)=>this.onClickSelectAll(e, pageResults)} className='select-all-input' type='checkbox' />
            </div>
            <div className='name'>
                <p>Name</p>
            </div>
            <div className='email'>
                <p>Email</p>
            </div>
            <div className='role'>
                <p>Role</p>
            </div>
            <div className='actions'>
                <p>Actions</p>
            </div>
        </li>
    )

    renderLoadingView = () => (
        <div className='loader'>
            <ThreeDots type="ThreeDots" color="#00bfff" width={30} height={30} />
        </div>
    )
    
    renderFailureView = () => (
        <div className='error-message'>
            <h1>Oops! Something went wrong</h1>
            <p>We are unable to process the request you made.</p>
        </div>
    )

    //Sets the data fetched from the server in the state
    getUserData = async () => {
        this.setState({isLoading:loadingStatus.loading})
        const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
        if (response.ok === true){
            const userData = await (response.json())
            this.setState({usersInformation:userData, isLoading:loadingStatus.success})
        }
        else{
            this.setState({isLoading:loadingStatus.failure})
        }
        
    }

    //Saves changes for the edited user details
    editUserDetails = (updatedDetails) => {
        const {usersInformation} = this.state
        
        const updatedUsersinformation = usersInformation.map(item => {
            if(item.id === updatedDetails.id){
                return updatedDetails
            }
            return item
        }) 

        this.setState({usersInformation:updatedUsersinformation})
    }
    
    //sets the active page on clicking a page button in pagination
    setActivePage = value => {
        let selectAll = document.getElementById('selectAll')
        selectAll.checked = false

        this.setState({activePage:value, selectedUserIds:[]})
    }

    //deletes the user from fetched data
    deleteUserFromInitialList = (value) => {
        const {usersInformation} = this.state
        const filteredData = usersInformation.filter(item => item.id!== value)
        this.setState({usersInformation:[...filteredData]})
    }

    //selects all the users in the page
    onClickSelectAll = (e, pageinateResults) => {
        if (e.target.checked){
            const paginateIds = pageinateResults.map(item => item.id)
            this.setState({selectedUserIds:paginateIds })
        }
        else{
            this.setState({selectedUserIds:[]})
        }
    }

    //All the selected ids are stored in selectedUserIds state
    //This function updates that state
    addOrRemoveSelectedRow = (e, id) => {
        if (!e.target.checked){
            let selectAll = document.getElementById('selectAll')
            selectAll.checked = false

            const {selectedUserIds} = this.state
            const updatedIds = selectedUserIds.filter(item => item !== id)
            this.setState({selectedUserIds:updatedIds})
        }
        else{
            const {selectedUserIds} = this.state
            const updatedIds = [...selectedUserIds, id]
            this.setState({selectedUserIds:updatedIds})
        }
    }

    //Deletes the selected users based on selectedUserIds
    deleteSelectedUsers = () => {
        const {usersInformation, selectedUserIds, activePage} = this.state
        const remainingUsers = usersInformation.filter(item => !selectedUserIds.includes(item.id))
        document.getElementById('selectAll').checked = false
        const noOfButtonsUpdated = Math.ceil(remainingUsers.length/noOfResultsPerPage)
        const newActivePage = (noOfButtonsUpdated < activePage)?noOfButtonsUpdated:activePage
            
        this.setState({usersInformation:remainingUsers, selectedUserIds:[], activePage:newActivePage})
    }

    //Filters the results to be shown based on the searchKey
    searchByFilters = (e) => {
        e.preventDefault();
        const searchInputValue = document.getElementById('searchInput').value
        this.setState({searchKey:searchInputValue.toLowerCase(), activePage:1})
    }

    render(){
        const {usersInformation, isLoading, activePage, searchKey, selectedUserIds} = this.state
        
        // Get only the users matching the searchinput entered
        const filteredUsersInformation = usersInformation.filter(item => {
            const {name, email, role} = item
            return (name.toLowerCase().includes(searchKey)||(email.toLowerCase().includes(searchKey)||(role.toLowerCase().includes(searchKey))))
        })
        
        const startIndex = (activePage-1)*noOfResultsPerPage
        const endIndex = activePage*noOfResultsPerPage
        const pageinateResults = filteredUsersInformation.slice(startIndex, endIndex);
        const numberOfButtons = Math.ceil(filteredUsersInformation.length/noOfResultsPerPage)

        return(
            <div className='admin-db-container'>
                <h1 className='heading'>Admin Dashboard</h1>
                {this.renderSearchBar()}
                {isLoading === loadingStatus.success && this.renderTable(pageinateResults, numberOfButtons, selectedUserIds, activePage)}
                {isLoading === loadingStatus.loading && this.renderLoadingView()}
                {isLoading === loadingStatus.failure && this.renderFailureView()}
            </div>
        )
    }
}

export default Dashboard