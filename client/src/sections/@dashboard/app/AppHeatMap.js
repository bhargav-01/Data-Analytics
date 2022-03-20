import {useEffect, useState} from 'react'
import { merge, result } from 'lodash';
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

export default function AppHeatMap() {

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
      var t2=[]
      for(var header of response.data.header)
      {
        var mapped = _.map(temp, _.partialRight(_.pick, [header])); 
        // var c=_.transform(mapped, function(result, value, key) {
        //     result.push(key)
        //   }, {});

        // console.log("D",_.mapValues(mapped,header));
        t2.push({name:header,data:Object.values(_.mapValues(mapped,header))}); 
      }
      setData(t2)
      // console.log("dd",t2)
  })
  },[]);
  
  const option={
    chart: {
      height: 350,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#34eb34"],
    title: {
      text: 'HeatMap Chart (Single color)'
    },
  }
  const data1=[{
    name: 'Metric1',
    data: [1,2,3,4,5,6,7,8,9,0],
  },
  {
    name: 'Metric2',
    data: [1,2,3,4,5,6,7,8,9,0]
  },
  {
    name: 'Metric3',
    data: [1,2,3,4,5,6,7,8,9,0],
  },
  {
    name: 'Metric4',
    data:[1,2,3,4,5,6,7,8,9,0],
  },
  {
    name: 'Metric5',
    data:[1,2,3,4,5,6,7,8,9,0],
  },
  {
    name: 'Metric6',
    data: [1,2,3,4,50,6,700,8,9,0],
  },
  {
    name: 'Metric7',
    data: [1,2,3,4,5,6,7,8,9,0],
  },
  {
    name: 'Metric8',
    data: [1,200,3,4,5,6,7,8,9,0],
  },
  {
    name: 'Metric9',
    data: [1,2,3,4,5,6,7,8,90,0],
  }]

  // console.log(data1);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="University Rating" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        {data!=null && <ReactApexChart options={option} series={data1} type="heatmap" height={350} />}
      </Box>
    </Card>
  );
}
