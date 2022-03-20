import { faker } from '@faker-js/faker';
import PropTypes from 'prop-types';
import firebaseConfig  from '../../../firebaseIni';
import { getStorage,ref,uploadBytes,getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import React,{useState,useEffect} from 'react';
import axios from 'axios';
// material
import { styled } from '@mui/material/styles';
import { Box,Button, Grid, Card, Paper, Typography, Input, CardHeader, CardContent } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// component
import Iconify from '../../../components/Iconify';




export default function AppUploadData() {
    const firebaseApp = initializeApp(firebaseConfig);
    const storage = getStorage(firebaseApp);
    const token = localStorage.getItem("token")
    const Input = styled('input')({
        display: 'none',
    });
    const [CSV,setCSV]=useState('');
    
    const UploadData=(event)=>{
        event.preventDefault();
        const now= new Date();
        const storageRef = ref(storage,`${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getTime()}.csv`);
        console.log(event.target.files[0]);
        uploadBytes(storageRef,event.target.files[0])
        .then((snapshot) => {
            getDownloadURL(storageRef)
            .then((url) => {
                console.log(url);
                alert(url);
                setCSV(url);
                axios.post('http://localhost:3001/dataset',{DataSetName:"Default",DataSetURL:url},{
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
    <Card  sx={{ height: '100%' }}>
      <CardHeader title="Traffic by Site" />
      <CardContent>
        <Grid container spacing={2}>
        <label htmlFor="contained-button-file">
                <Input accept=".csv" id="contained-button-file" multiple type="file" onChange={UploadData}/>
                <Button
                    variant="contained"
                    component="span"
                    // to="#"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    
                >
                    Upload DataSet
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
  );
}
