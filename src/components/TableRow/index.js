import { Component } from "react";
import {RiEditBoxLine, RiSave3Line} from 'react-icons/ri'
import {AiOutlineDelete} from 'react-icons/ai'

import '../Dashboard/index.css'
import './index.css'

class TableRow extends Component{
    state = {isEditable:false, nameInput:this.props.name, emailInput:this.props.email, roleInput:this.props.role, isChecked:false}

    componentDidMount(){
        const {userDetails} = this.props
        const {name, email, role} = userDetails

        this.setState({nameInput:name, emailInput:email, roleInput:role})
    }

    changeEditState = () => {
        this.setState(prevState => ({isEditable:!prevState.isEditable}))
    }

    onChangeEmail = e => {
        this.setState({emailInput:e.target.value})
    }

    onChangeName = e => {
        this.setState({nameInput:e.target.value})
    }

    onChangeRole = e => {
        this.setState({roleInput:e.target.value})
    }

    saveChanges = () => {
        const {id} = this.props.userDetails
        const {editUserDetails} = this.props
        const {nameInput, emailInput, roleInput} = this.state
        const updatedObject = {id, name:nameInput, email:emailInput, role:roleInput}

        this.setState({isEditable:false}, editUserDetails(updatedObject));
    }

    deleteUser = () => {
        const {deleteUserFromInitialList, userDetails} = this.props
        const {id} = userDetails
        deleteUserFromInitialList(id)
    }

    selectOrDeselectRow = (e, id) => {
        const {addOrRemoveSelectedRow} = this.props
        addOrRemoveSelectedRow(e, id)
    }


    render(){
        const {isEditable, nameInput, emailInput, roleInput} = this.state
        const {userDetails, isChecked} = this.props
        const {name, email, role, id} = userDetails

        return(
            <li className={`table-row ${isChecked?'active-style':''}`}>
                <div className='select-row-box'>
                    <input checked={isChecked} onChange={(e)=>this.selectOrDeselectRow(e, id)} className='select-row-input' type='checkbox' />
                </div>
                <div className='name'>
                    {!isEditable&&<p>{name}</p>}
                    {isEditable&&<input onChange={this.onChangeName} type="text" value={nameInput} />}
                </div>
                <div className='email'>
                    {!isEditable&&<p>{email}</p>}
                    {isEditable&&<input onChange={this.onChangeEmail} type="text" value={emailInput} />}
                </div>
                <div className='role'>
                    {!isEditable&&<p>{role}</p>}
                    {isEditable&&<input onChange={this.onChangeRole} type="text" value={roleInput} />}
                </div>
                <div className='actions-icons'>
                    {isEditable&&<button className="save-button"><RiSave3Line onClick={this.saveChanges} className="save-icon" /></button>}
                    {!isEditable&&<button className="edit-button"><RiEditBoxLine onClick={this.changeEditState} className="edit-icon" /></button>}
                    <button className="delete-user-button"><AiOutlineDelete onClick={this.deleteUser} className="delete-icon" /></button>
                </div>
            </li>
        )
    }
}

export default TableRow