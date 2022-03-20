import React,{useEffect,useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { TextField } from '@mui/material';
import axios from 'axios';
export default function DropDownData() {
  
    const instance = axios.create({
        baseURL: 'http://localhost:3001',
        headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
    });
    const [alldatasets,setDatasets]=useState(null)
    useEffect(() => {
       
        instance.get('/dataset/datadisplay')
        .then(response=>{
            console.log(response.data)
            setDatasets(response.data);
            
        });
        console.log('EH')
        console.log(alldatasets)
    },[])
  
  
    const [dataset, setData] = React.useState('');

  const handleChange = (event) => {
   
    event.preventDefault();
    setData(event.target.value);
    
  };

  return (
    <div>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        
          {alldatasets!=null && <TextField label='Dataset' select size="small" value={dataset} onChange={(e)=>handleChange(e)}  > 
            {alldatasets.map((dataset) => {
                    return (
                        <MenuItem value={dataset.DataSetName}>
                            {dataset.DataSetName}<br></br>
                            {/* {dataset} */}
                        </MenuItem>
                    );
                }
                )}</TextField>}


      </FormControl>
    </div>
  );
}
