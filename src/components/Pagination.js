import "./Pagination.css";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

const Pagination = ({totalPages, setUsersWithPageNo})=>{

    return(
        <div className="page-number-container">
        <div className="previous-page" id={1} onClick={setUsersWithPageNo}> <FirstPageIcon/> </div>
        <div className="previous-page" id="-" onClick={setUsersWithPageNo}>Previous</div>
        { 
            (totalPages.length>0) && 
            (totalPages.map((number, idx)=>
            <div className="page-number" key={idx.toString()} id={number} onClick={setUsersWithPageNo}>
                {number}
            </div>
            ))
        }
        <div className="next-page" id={totalPages.length} onClick={setUsersWithPageNo}> <LastPageIcon/> </div>
        <div className="next-page" id="+" onClick={setUsersWithPageNo}>Next</div>
        </div>
        
    );
}

export default Pagination;
