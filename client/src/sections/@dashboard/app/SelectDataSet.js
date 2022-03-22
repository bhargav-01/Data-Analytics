import React,{useEffect,useState,useContext} from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { TextField } from '@mui/material';
import axios from 'axios';
export default function SelectDataSet(props) {
    const instance = axios.create({
        baseURL: 'http://localhost:3001',
        headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
    });
    
    const [alldatasets,setDatasets]=useState(null)
    useEffect(() => {
       
        instance.get('/dataset/datadisplay')
        .then(response=>{
            setDatasets(response.data);
            
        });
        
    },[])
  
  
  const [dataset, setData] = React.useState('');

  const handleChange = (event) => {
    alert("Database change")
    event.preventDefault();
    setData(event.target.value);
    console.log(event)
    props.SelectSet(event.target.value)
    // localStorage.setItem('dataURL')
    // API.get('/', {params: {dataURL: event.target.value}})
    // .then(response=>{
    //   console.log(response)
    //   console.log(data2.data)
    //   // SetData(response.data,response.header)
    // });

  };

  return (
    <div>
      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        
          {alldatasets!=null && <TextField label='Dataset' select size="small" value={dataset} onChange={(e)=>handleChange(e)}  > 
            {alldatasets.map((dataset) => {
                    return (
                        <MenuItem value={dataset.DataSetURL}>
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
