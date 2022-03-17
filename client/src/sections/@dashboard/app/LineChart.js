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

export default function LineChart() {

  const token = localStorage.getItem("token")
  const theme = useTheme();
  const API = axios.create({
    baseURL: 'http://localhost:3001/dataset/',
    headers: {'Authorization': `Bearer ${token}`}
  });
  const [data,setData]=useState('')
  const data1 = [{
    name: "SAMPLE A",
    data: [
    [16.4, 5.4], [21.7, 2], [25.4, 3], [19, 2], [10.9, 1], [13.6, 3.2], [10.9, 7.4], [10.9, 0], [10.9, 8.2], [16.4, 0], [16.4, 1.8], [13.6, 0.3], [13.6, 0], [29.9, 0], [27.1, 2.3], [16.4, 0], [13.6, 3.7], [10.9, 5.2], [16.4, 6.5], [10.9, 0], [24.5, 7.1], [10.9, 0], [8.1, 4.7], [19, 0], [21.7, 1.8], [27.1, 0], [24.5, 0], [27.1, 0], [29.9, 1.5], [27.1, 0.8], [22.1, 2]]
  },{
    name: "SAMPLE B",
    data: [
    [36.4, 13.4], [1.7, 11], [5.4, 8], [9, 17], [1.9, 4], [3.6, 12.2], [1.9, 14.4], [1.9, 9], [1.9, 13.2], [1.4, 7], [6.4, 8.8], [3.6, 4.3], [1.6, 10], [9.9, 2], [7.1, 15], [1.4, 0], [3.6, 13.7], [1.9, 15.2], [6.4, 16.5], [0.9, 10], [4.5, 17.1], [10.9, 10], [0.1, 14.7], [9, 10], [12.7, 11.8], [2.1, 10], [2.5, 10], [27.1, 10], [2.9, 11.5], [7.1, 10.8], [2.1, 12]]
  },{
    name: "SAMPLE C",
    data: [
    [21.7, 3], [23.6, 3.5], [24.6, 3], [29.9, 3], [21.7, 20], [23, 2], [10.9, 3], [28, 4], [27.1, 0.3], [16.4, 4], [13.6, 0], [19, 5], [22.4, 3], [24.5, 3], [32.6, 3], [27.1, 4], [29.6, 6], [31.6, 8], [21.6, 5], [20.9, 4], [22.4, 0], [32.6, 10.3], [29.7, 20.8], [24.5, 0.8], [21.4, 0], [21.7, 6.9], [28.6, 7.7], [15.4, 0], [18.1, 0], [33.4, 0], [16.4, 0]]
  }]

  useEffect(() =>{
    // var a=[]
    API.get('/')
    .then(response=>{
      var temp=response.data.data
      var mapped = _.map(temp, _.partialRight(_.pick, ['GRE Score', 'Chance of Admit']));
      
      var t2=[]
      for(var [key,value] of Object.entries(mapped))
      {
        t2.push([value['GRE Score'],value['Chance of Admit']])
      }
      setData(t2)
    console.log(t2)
  })
  },[]);
  
  
  const option={
    chart: {
      height: 350,
      type: 'scatter',
      zoom: {
        enabled: true,
        type: 'xy'
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
    yaxis: {
      tickAmount: 7
    }
  }
  
  return (
    <Card>
      <CardHeader title="University Rating" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        {data!=null && <ReactApexChart options={option} series={[{data:data}]} type="scatter" height={350} />}
        {/* {data!=null && <ReactApexChart type="line" series={[{data:data}]} options={chartOptions} height={364} />} */}
      </Box>
    </Card>
  );
}
