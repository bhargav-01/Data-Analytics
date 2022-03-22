import {
  UploadData,
  SelectDataSet,
  DataExcel
} from '../sections/@dashboard/datasets';
import Page from '../components/Page';
import {Typography,Container} from '@mui/material';
import React from 'react';
import { useState,useEffect } from 'react';
import { setDate } from 'date-fns';
import axios from 'axios'

// ----------------------------------------------------------------------

export default function DataUpload(props) {
  const [data,setData]=useState(null);
  const [header,setHeader]=useState(null);
  const API = axios.create({
    baseURL: 'http://localhost:3001/dataset',
    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
  });
  useEffect(()=>{
    //API call to data[0]
    
    
      API.get('/')
        .then(response=>{
            console.log("hello",response)
            setData(response.data.data)
            var temp=[];
            for(var column of response.data.header)
            {
                // console.log(column)
                if(column!='id')
                {
                    temp.push({field: column,
                        headerName: column,
                        width: 150})
                }
                else
                {
                    temp.push({ field: 'id', headerName: 'ID', width: 90 })
                }
            
            }
            setHeader(temp)
                
                });
    
    
},[])

  const SelectSet=(data)=>
  {
    alert("SetSelect");
    // setData(data);
    API.get('/datajson', {params: {dataURL: data}})
    .then(response=>{
      
      console.log("no idea",response.data)
      var temp=[];
      for(var column of response.data.header)
      {
        console.log(column);
          if(column!='id')
          {
              temp.push({field: column,
                  headerName: column,
                  width: 150})
          }
          else
          {
              temp.push({ field: 'id', headerName: 'ID', width: 90 })
          }
      }
      setData(null)
      setHeader(null)
      setHeader(temp)
      setData(response.data.data)
      // console.log(response.data.data)
    });
    
  } 
  return (
    <Page title="User DataSets">
        <Container>
        <Typography variant="h4" gutterBottom>
            User DataSets
        </Typography>
            <SelectDataSet SelectSet={SelectSet}></SelectDataSet>
            <UploadData props={props}/>
            <DataExcel data={data} header={header}/>          
        </Container>
    </Page>
    // console.log("Hello"),
    // <div>Hello</div>    
  );
}
