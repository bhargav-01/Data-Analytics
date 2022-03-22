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
    if(props.data!=null)
    {
      var temp=props.data.data
      setData(temp)
      var mapped = _.map(temp, _.partialRight(_.pick, [props.data.header[0], props.data.header[1]]));
      var t2=[]
      for(var [key,value] of Object.entries(mapped))
      {
        t2.push([value[props.data.header[0]],value[props.data.header[1]]])
      }
      t2.sort(function(a,b){ return a[0]-b[0]});
      // console.log("hello",t2[0]);
      setselectX(props.data.header[0]);
      setselectY(props.data.header[1]);
      setChartData(t2);
      setOptions(props.data.header)
    }
  },[props.data]);

  
  
  const handelchangeX=(e)=>{
    setselectX(e.target.value);
    var temp=data; 
    var mapped = _.map(temp, _.partialRight(_.pick, [e.target.value, selecty]));
    var t2=[]
    for(var [key,value] of Object.entries(mapped))
    {
      t2.push([value[e.target.value],value[selecty]])
    }
    t2.sort(function(a,b){ return a[0]-b[0]});
    setChartData(t2);
  }

  const handelchangeY=(e)=>{
    setselectY(e.target.value);
    // console.log(e.target.value)
    // console.log(selectx," ",selecty)
    var temp=data; 
    var mapped = _.map(temp, _.partialRight(_.pick, [selectx, e.target.value]));
    var t2=[]
    for(var [key,value] of Object.entries(mapped))
    {
      t2.push([value[selectx],value[e.target.value]])
    }
    t2.sort(function(a,b){ return a[0]-b[0]});
    setChartData(t2);
  }

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: 2 },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    colors:['#ffe700'],
    fill: {
        type: "gradient",
        gradient: {
        //   shadeIntensity: 0.1,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90]
        }
    },
    zoom: {
        enabled: true,
        type: 'x',  
        autoScaleYaxis: false,  
        zoomedArea: {
          fill: {
            color: '#90CAF9',
            opacity: 0.4
          },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1
          }
        }
    },
    xaxis: {
        tickAmount: 10,
        labels: {
          formatter: function(val) {
            return parseFloat(val).toFixed(1)
          }
        }
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
  });
//   const option={
//     stroke: {
//         width: 3,
//         curve: 'smooth',
//     },
//     plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },

//     chart: {
//       height: 350,
//       type: 'line',
//       // zoom: {
//       //   enabled: true,
//       //   type: 'xy'
//       // }
//     },
//     xaxis: {
//         // labe
//     //   tickAmount: 10,
//     //   labels: {
//     //     formatter: function(val) {
//     //       return parseFloat(val).toFixed(1)
//     //     }
//     //   }
//     },
//     yaxis: {
//       tickAmount: 7
//     },
//     tooltip: {
//       shared: true,
//       intersect: false,
//       y: {
//         formatter: (y) => {
//           if (typeof y !== 'undefined') {
//             return `${y.toFixed(0)} visits`;
//           }
//           return y;
//         }
//       }
//     }
//   }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Line Chart" 
         action={
          <IconButton aria-label="settings" onClick={()=>props.onRemoveItem(props.id)}>
            < Iconify icon="iconoir:cancel"/>
          </IconButton>
        }
      />
      <Container>
        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h5" gutterBottom>
              X
            </Typography> */}
            
            {options!=null && <TextField select size="small" value={selectx} onChange={(e)=>handelchangeX(e)}  >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>}
        {/* </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h5" gutterBottom>
              Y
            </Typography> */}
            
            {options!=null && <TextField select size="small" style={{marginLeft:"10px"}} value={selecty} onChange={(e)=>handelchangeY(e)}  >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>}
        {/* </Stack> */}
      </Container>
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        {chartData!=null && <ReactApexChart options={chartOptions} series={[{data:chartData}]} type="area" height={350} />}
      </Box>
    </Card>
  );
}
