import {useEffect, useState} from 'react'
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import {Box,IconButton, Stack, Card, CardHeader,Container,MenuItem, TextField, Typography } from '@mui/material';
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

export default function AppCurrentVisits(props) {

  const token = localStorage.getItem("token")
  const theme = useTheme();
  const API = axios.create({
    baseURL: 'http://localhost:3001/dataset/',
    headers: {'Authorization': `Bearer ${token}`}
  });
  const [pieData,setPieData]=useState(null)
  const [data,setData]=useState(null)
  const [label,setLabel]=useState(null)
  const [options,setOptions]=useState(null)

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
      setOptions(props.data.header)
      setSelected(props.data.header[1]);
      setPieData(a)
    }
  },[props.data]);

  
  
//   const chartOptions = merge(BaseOptionChart(), {
//     tooltip: {
//       marker: { show: false },
//       y: {
//         formatter: (seriesName) => fNumber(seriesName),
//         title: {
//           formatter: (seriesName) => `#${seriesName}`
//         }
//       }
//     },
//     plotOptions: {
//       bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
//     },
//   });

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ],
    // labels: label!=null && label ,
    // stroke: { colors: [theme.palette.background.paper] },
    // legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
        bar: {horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'}
    },
  });

  const [selected,setSelected]=useState(null)

  const handelchange=(e)=>{
    setSelected(e.target.value);
    var temp=data;
    var ss=_.groupBy(temp,e.target.value)
    var a=_.transform(ss, function(result, value, key) {
      result[key]=value.length
      return result
    })
    setLabel(Object.keys(a))
    setPieData(a);
  }
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={'Bar Chart'} action={
          <IconButton aria-label="settings" onClick={()=>props.onRemoveItem(props.id)}>
            < Iconify icon="iconoir:cancel"/>
          </IconButton>
        }/>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h5" gutterBottom>
              Column
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

      
      <ChartWrapperStyle dir="ltr">
        {pieData!=null && <ReactApexChart type="bar" series={[{data:Object.values(pieData)}]} options={chartOptions} height={280} />}
      </ChartWrapperStyle>
    </Card>
  );
}
