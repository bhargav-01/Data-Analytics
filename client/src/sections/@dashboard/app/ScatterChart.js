import {useEffect, useState} from 'react'
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import {Box, IconButton, Card, CardHeader,Container,MenuItem, TextField, Typography,Stack } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../components/charts';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Iconify from "src/components/Iconify";

// db
import { daysToWeeks } from 'date-fns';
const _ = require("lodash");

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

// const CHART_DATA = [4344, 5435, 1443, 4443];
const CHART_DATA = [
  {
    name: 'Team A',
    type: 'column',
    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
  },
  {
    name: 'Team B',
    type: 'area',
    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
  },
  {
    name: 'Team C',
    type: 'line',
    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
  }
];

export default function ScatterChart(props) {

  const token = localStorage.getItem("token")
  const theme = useTheme();
  const API = axios.create({
    baseURL: 'http://localhost:3001/dataset/',
    headers: {'Authorization': `Bearer ${token}`}
  });
  const [data,setData]=useState(null)
  const [selectx,setselectX]=useState(null)
  const [selecty,setselectY]=useState(null)
  const [chartData,setChartData]=useState(null)
  const [label,setLabel]=useState(null)
  const [options,setOptions]=useState(null)

  useEffect(() =>{
    if(data==null)
    {  
      // console.log("sss")
        API.get('/')
        .then(response=>{
          var temp=response.data.data
          setData(temp)
          var mapped = _.map(temp, _.partialRight(_.pick, [response.data.header[0], response.data.header[1]]));
          var t2=[]
          for(var [key,value] of Object.entries(mapped))
          {
            t2.push([value[response.data.header[0]],value[response.data.header[1]]])
          }
          setselectX(response.data.header[0]);
          setselectY(response.data.header[1]);
          setChartData(t2);
          setOptions(response.data.header)
          // console.log("rr",t2)
      })
    }
  },[]);
  
  
  const handelchangeX=(e)=>{
    setselectX(e.target.value);
    var temp=data; 
    var mapped = _.map(temp, _.partialRight(_.pick, [e.target.value, selecty]));
    var t2=[]
    for(var [key,value] of Object.entries(mapped))
    {
      t2.push([value[e.target.value],value[selecty]])
    }
    setChartData(t2);
  }

  const handelchangeY=(e)=>{
    setselectY(e.target.value);
    console.log(e.target.value)
    console.log(selectx," ",selecty)
    var temp=data; 
    var mapped = _.map(temp, _.partialRight(_.pick, [selectx, e.target.value]));
    var t2=[]
    for(var [key,value] of Object.entries(mapped))
    {
      t2.push([value[selectx],value[e.target.value]])
    }
    console.log("t2",t2)
    setChartData(t2);
  }

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: 0 },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: [
      '01/01/2003',
      '02/01/2003',
      '03/01/2003',
      '04/01/2003',
      '05/01/2003',
    ],
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} visits`;
          }
          return y;
        }
      }
    }
  });
  const option={
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },

    chart: {
      height: 350,
      type: 'scatter',
      // zoom: {
      //   enabled: true,
      //   type: 'xy'
      // }
    },
    xaxis: {
      tickAmount: 10,
      labels: {
        formatter: function(val) {
          return parseFloat(val).toFixed(1)
        }
      }
    },
    yaxis: {
      tickAmount: 7
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} visits`;
          }
          return y;
        }
      }
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="University Rating" 
       action={
        <IconButton aria-label="settings" onClick={()=>props.onRemoveItem(props.id)}>
          < Iconify icon="iconoir:cancel"/>
        </IconButton>
      }/>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h5" gutterBottom>
              X
            </Typography>
            
            {options!=null && <TextField select size="small" value={selectx} onChange={(e)=>handelchangeX(e)}  >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>}
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h5" gutterBottom>
              Y
            </Typography>
            
            {options!=null && <TextField select size="small" value={selecty} onChange={(e)=>handelchangeY(e)}  >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>}
        </Stack>
      </Container>
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        {chartData!=null && <ReactApexChart options={option} series={[{data:chartData}]} type="scatter" height={350} />}
      </Box>
    </Card>
  );
}
