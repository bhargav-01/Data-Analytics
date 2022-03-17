import {useEffect, useState} from 'react'
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import {Box,  Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../components/charts';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';

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

export default function LineChart() {

  const token = localStorage.getItem("token")
  const theme = useTheme();
  const API = axios.create({
    baseURL: 'http://localhost:3001/dataset/',
    headers: {'Authorization': `Bearer ${token}`}
  });
  const [data,setData]=useState('')


  useEffect(() =>{
    // var a=[]
    API.get('/')
    .then(response=>{
      var temp=response.data.data
      var ss=_.groupBy(temp,'University Rating')
      var a=_.transform(ss, function(result, value, key) {
        result[key]=value.length
        return result
      })
      var temp=[]
      for(var [key,value] of Object.entries(a))
      {
          temp.push({x:key,y:value})
      }
      setData(temp)

    })
  },[]);
  
  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    
    xaxis: { type: 'category' },
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

  return (
    <Card>
      <CardHeader title="University Rating" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        {data!=null && <ReactApexChart type="line" series={[{data:data}]} options={chartOptions} height={280} />}
      </Box>
    </Card>
  );
}
