import "./Landing.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import Data from "./data";

let selectedItems = [];
let dataLength = Data.length;
let currentPage = 1;
let timer;

const Table = ()=>{
    const [usersData, setUsersData] = useState(Data);
    const [displayUsers, setDisplayUsers] = useState(usersData.slice(0, 10));
    const [recordsPerPage] = useState(10);
    const [selectAll, setSelectAll] = useState(false);
    const [pages, setPages] = useState([]);
    const [editUser, setEditUser] = useState(-1);
    
    const calculatePages = ()=>{
        let totalRecords = usersData.length;
        let temp = totalRecords/recordsPerPage;
        let remainder = totalRecords%recordsPerPage;
        if (remainder > 0) temp+=1;

        let arr = [];
        for (let i=1; i<=temp; i++){
            arr.push(i);
        }
        setPages(arr);
    }
    
    const setTableWithPageNo = (event, edit)=>{

        let pageNo;
        if (!event && !edit) pageNo = 1;
        else if(edit) pageNo = edit;
        else pageNo = event.currentTarget.id;

        if (pageNo === "+") pageNo = currentPage+1;
        if (pageNo === "-") pageNo = currentPage-1;
        if (pageNo === "last") pageNo = pages.length;

        if (pageNo === 0) pageNo = 1;
        if (pageNo > pages.length) pageNo = pages.length;

        let lastRecord = recordsPerPage*pageNo;
        let firstRecord = lastRecord - recordsPerPage;
        if (lastRecord > usersData.length){
            lastRecord =usersData.length;
        }

        let arr = usersData.slice(firstRecord, lastRecord);
        setDisplayUsers(arr);
        currentPage = pageNo;
        setSelectAll(false);
    }

    const selectBox = (event)=>{
        if (event.target.id === "all"){
            setSelectAll(event.target.checked);
        }
        else{
            if (event.target.checked){
                selectedItems.push(event.target.id);
                selectedItems.sort();
            }
            else{
                for (let i=0; i<selectedItems.length; i++){
                    if (selectedItems[i] === event.target.id){
                        selectedItems.splice(i,1);
                        break;
                    }
                }
            }
        }
    }

    const deleteOne = (event)=>{
        let userId = event.currentTarget.id;
        let arr = usersData;
        let idx = -1;
        for (let i=0; i<usersData.length; i++){
            if (usersData[i].id === userId){
                idx = i;
                break;
            }
        }
        arr.splice(idx,1);
        setUsersData(arr);
        setTableWithPageNo(undefined, 1);
    }

    const deleteSelected = ()=>{
        for (let i=0; i<selectedItems.length; i++){
            for (let j=0; j<usersData.length; j++){
                if (selectedItems[i] === usersData[j].id){
                    usersData.splice(j,1);
                }
            }
        }
        for (let i=0; i<selectedItems.length; i++){
            let ele = document.getElementById(selectedItems[i]);
            ele.checked = false;
        }
        selectedItems = [];
        setTableWithPageNo();
    }

    const editButton = (event)=>{
        setEditUser(event.currentTarget.id);
    }

    const showEditedUser = ()=>{
        let email = document.getElementById("email").value;
        let role = document.getElementById("role").value;

        for (let i=0; i<usersData.length; i++){
            if (usersData[i].id === editUser){
                if (email) usersData[i].email = email;
                if (role) usersData[i].role = role;
            }
        }
        let event;
        setTableWithPageNo(event, currentPage);
        setEditUser(false);
    }

    const searchUsers = (searchValue)=>{
        let arr = [];
        searchValue = searchValue.toLowerCase();
        if (searchValue === ""){
            arr = Data;
        }
        else if (searchValue === "member" || searchValue === "admin"){
            arr = usersData.filter((user)=>{
                let temp;
                if (user.role ===searchValue) temp= user;
                return temp;
            })
        }
        else{
            arr = usersData.filter((user)=>{
                if (user.name.toLowerCase() ===searchValue || user.email === searchValue) return user;
            })
        }

        if (arr.length === 0){
            arr = Data;
        }
        setUsersData(arr);
    }

    const debounceSearch = (event)=>{
        if (timer){
          clearTimeout(timer);
        }
        timer = setTimeout(()=>{
            let searchValue = event.target.value;
            if (searchValue<=4) searchValue=""
            searchUsers(searchValue);
        },500);  
    }

    useEffect(()=>{

        if (usersData.length !== dataLength){
            dataLength = usersData.length;
            setTableWithPageNo();
            calculatePages();
            setSelectAll(false);
        }
    })

    useEffect(()=>{
        calculatePages();    
    }, [])

    return (
        <div className="container">
        <input type="text" className="search-field" placeholder="Search by name, email or role" onChange={debounceSearch}/>
        <table className="table">
            <thead>
                <tr>
                    <th><input type="checkbox" id="all" onChange={selectBox} checked={selectAll}/></th>                    
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                <tr></tr>
            </thead>

            <tbody>
            {
                
                displayUsers.map((user, idx)=>( 
                    (editUser !== user.id)?
                    <tr key={idx.toString()}>
                        {
                        (selectAll === true)?
                        <td><input type="checkbox" onChange={selectBox} checked={selectAll}/></td>
                        :
                        <td>
                            <input 
                                type="checkbox"     
                                className="checkbox" 
                                key={user.id}
                                id={user.id} 
                                onChange={selectBox} 
                            />
                        </td>
                        }
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            <span className="button" id={user.id} onClick={editButton}>
                                <EditIcon />
                            </span>
                            &nbsp; 
                            <span className="button" id={user.id} onClick={deleteOne}>
                                <DeleteIcon color="error"/>
                            </span>
                        </td>
                    </tr>
                    :
                    <tr key={idx.toString()}>
                        <td><input type="checkbox" className="checkbox" key={user.id} id={user.id} onChange={selectBox}/></td>
                        <td> {user.name} </td>
                        <td> 
                            <input 
                                type="text" 
                                placeholder="Enter email" 
                                id={"email"} 
                            /> 
                        </td>
                        <td> 
                            <input 
                                type="text" 
                                placeholder="Enter role" 
                                id={"role"} 
                            /> 
                        </td>
                        <td>
                            <span className="button"> 
                                <CheckCircleOutlineIcon onClick={showEditedUser}/> 
                            </span>
                            <span id={user.id} className="button" onClick={editButton}>
                                <EditIcon/>
                            </span>
                                &nbsp;  
                            <span id={user.id} className="button" onClick={deleteOne}>
                                <DeleteIcon color="error"/>
                            </span>
                        </td>
                    </tr>
                ))              
            }
            </tbody>
        </table>
        
        <div className="container-bottom">
        <span className="delete-selected" onClick={deleteSelected}>Delete Selected</span>
        <Pagination 
            totalPages={pages}
            setUsersWithPageNo={setTableWithPageNo}
        />
        </div>
        </div>
    );
}

export default Table;