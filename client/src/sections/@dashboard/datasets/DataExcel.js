import React, { useEffect, useContext,useState } from 'react'
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import {
    Box,
    Card,
    CardHeader,
  } from '@mui/material';
export default function DataExcel(props) {
    const [ans,setans]=React.useState(props.data);
    const [err,seterr]=React.useState();
    const [header,setHeader]=React.useState(props.header);
    const token = localStorage.getItem("token")
    const [Dat,SetDat]=useState(null);

   

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title="Data" />
            <Box sx={{ px: 3, py: 1 }}>
                <div style={{ height: 600, width: '100%' }}>
                { 
                    props.data!=null && props.header!=null &&
                    <DataGrid
                        rows={props.data}
                        columns={props.header}
                        getRowId={(row) => row.id}
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