import {useEffect, useState} from 'react'
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled,alpha } from '@mui/material/styles';
import {Box,IconButton, Stack, Card, CardHeader,Container,MenuItem, TextField, Typography } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../components/charts';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Iconify from "src/components/Iconify";
import { fShortenNumber } from '../../../utils/formatNumber';
// db
import { daysToWeeks } from 'date-fns';
const _ = require("lodash");
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;

export default function AppWeeklySales(props) {
  
  const token = localStorage.getItem("token")
    const theme = useTheme();
    const API = axios.create({
        baseURL: 'http://localhost:3001/dataset/',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    // const [data, setData] = useState(null)
    const [MinData,setMinData]=useState(null)
    const [data,setData]=useState(null)
    const [label,setLabel]=useState(null)
    const [options,setOptions]=useState(null)
    const [fn,setFn]=useState(null)
  
    useEffect(() =>{
      if(props.data!=null)
      {
        var temp=props.data.data;
        setData(props.data.data)
        var ss=_.groupBy(temp,props.data.header[1])
        var a=_.transform(ss, function(result, value, key) {
          result[key]=value.length
          return result
        })
        setLabel(Object.keys(a))
        // console.log(response.data.header)
        setOptions(props.data.header)
        setSelected(props.data.header[1]);
        setMinData(a)
      }
    },[props.data]);


    const [selected,setSelected]=useState(null)

    const handelchange=(e)=>{
      setSelected(e.target.value);
      var temp=data;
      // var ss=_.groupBy(temp,e.target.value)
      // var a=_.transform(ss, function(result, value, key) {
      //   result[key]=value.length
      //   return result
      // })
      // setLabel(Object.keys(a))
      //var userIds = temp.map( function(obj) { return obj.id; } );
      var ss=_.map(temp,e.target.value)
      
      
      setMinData(_.min(ss));
      setFn(e.target.value)
    //   console.log(_.sum(sq)/_.size(sq))
    }
  return (
    <Card sx={{ height: '100%',margin:"0px",padding:"0px",backgroundColor:"#75ff00"}}>
        <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h5" gutterBottom>
              Minimum
            </Typography>
            
            {options!=null && <TextField select size="small" value={selected} onChange={(e)=>handelchange(e)}  >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>}
        </Stack>
      </Container>
        <RootStyle sx={{ height: '100%',margin:"0px",padding:"0px",backgroundColor:"#75ff00"}}>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
            <IconButton aria-label="settings" onClick={() => props.onRemoveItem(props.id)}>
                      < Iconify icon="iconoir:cancel" />
              </IconButton>
            </div>
            <IconWrapperStyle>
                <Iconify icon="carbon:chart-minimum" width={24} height={24} />
            </IconWrapperStyle>
            <Typography variant="h3">{fShortenNumber(MinData)}</Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                {fn}
            </Typography>
        </RootStyle>
    </Card>
    
  );
}
