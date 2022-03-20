import React, { useEffect } from 'react'
import axios from 'axios'
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import {
    Box,
    Card,
    CardHeader,
  } from '@mui/material';

export default function AppExcel() {
    const [ans,setans]=React.useState(null);
    const [err,seterr]=React.useState(null);
    const [header,setHeader]=React.useState(null);
    const token = localStorage.getItem("token")

    const API = axios.create({
        baseURL: 'http://localhost:3001/dataset/',
        headers: {'Authorization': `Bearer ${token}`}
    });

    useEffect(()=>{
        API.get('/')
        .then(response=>{
            // console.log(response.data.data)
            setans(response.data.data)
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

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title="Data" />
            <Box sx={{ px: 3, py: 1 }}>
                <div style={{ height: 600, width: '100%' }}>
                { 
                    ans!=null && header!=null &&
                    <DataGrid
                        rows={ans}
                        columns={header}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        disableSelectionOnClick/>
                }
                </div>
            </Box>
        </Card>
            
        // </div>
    )
}

// export default AppExcel