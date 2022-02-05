import { Component } from "react";
import {RiEditBoxLine, RiSave3Line} from 'react-icons/ri'
import {AiOutlineDelete} from 'react-icons/ai'

import '../Dashboard/index.css'
import './index.css'

class TableRow extends Component{
    state = {isEditable:false, nameInput:this.props.userDetails.name, emailInput:this.props.userDetails.email, roleInput:this.props.userDetails.role, isChecked:false}

    

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
                    {isEditable&&<button onClick={this.saveChanges} className="save-button"><RiSave3Line className="save-icon" /></button>}
                    {!isEditable&&<button onClick={this.changeEditState} className="edit-button"><RiEditBoxLine className="edit-icon" /></button>}
                    <button onClick={this.deleteUser} className="delete-user-button"><AiOutlineDelete className="delete-icon" /></button>
                </div>
            </li>
        )
    }
}

export default TableRow