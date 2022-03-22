import { faker } from '@faker-js/faker';
import PropTypes from 'prop-types';
import firebaseConfig  from '../../../firebaseIni';
import { getStorage,ref,uploadBytes,getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import React,{useState,useEffect,useReducer} from 'react';
import axios from 'axios';
// material
import { styled } from '@mui/material/styles';
import { Box,Button, Grid, Card, Paper, Typography, Input, CardHeader, CardContent } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// component
import Iconify from '../../../components/Iconify';
import _ from 'lodash';



export default function UploadData(props) {
    const firebaseApp = initializeApp(firebaseConfig);
    const storage = getStorage(firebaseApp);
    const token = localStorage.getItem("token")
    const Input = styled('input')({
        display: 'none',
    });
    const [CSV,setCSV]=useState('');

    const instance = axios.create({
        baseURL: 'http://localhost:3001',
        headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
    });
    const [alldatasets,setDatasets]=useState(null)
    // useEffect(() => {
       
    //     instance.get('/dataset/datadisplay')
    //     .then(response=>{
    //         console.log(response.data)
    //         setDatasets(response.data);
            
    //     });
    //     console.log('EH')
    //     console.log(alldatasets)
    // },[])

    const UploadData1=(event)=>{
        event.preventDefault();
        console.log(event.name)
        const now= new Date();
        const storageRef = ref(storage,`${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getTime()}.csv`);
        console.log(event.target.files);
        uploadBytes(storageRef,event.target.files[0])
        .then((snapshot) => {
            getDownloadURL(storageRef)
            .then((url) => {
                console.log(url);
                alert(url);
                setCSV(url);
                axios.post('http://localhost:3001/dataset',{DataSetName:event.target.files[0].name,DataSetURL:url},{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                  }) 
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }
  
    return (
    <div>
    {alldatasets!=null && alldatasets.map((dataset) => {
                    return (
                        <div className="col-12">
                            {dataset.DataSetName}<br></br>
                            {/* {dataset} */}
                        </div>
                    );
                })}
    {/* {alldatasets}
     */}
    
    <Card>
      <CardHeader/>
      <CardContent>
        <Grid container spacing={2}>
        <label htmlFor="contained-button-file">
                <Input accept=".csv" id="contained-button-file" multiple type="file" onChange={UploadData1}/>
                <Button
                    variant="contained"
                    component="span"
                    // to="#"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    
                >
                    Upload New DataSet
                </Button>
            </label>

        {/* <label htmlFor="contained-button-file">
        <Input accept="image/*" id="contained-button-file" multiple type="file" />
        <Button variant="contained" component="span">
            Upload
        </Button>
        </label> */}
        
        </Grid>
      </CardContent>
    </Card>
    </div>
  );
}
