import {useEffect} from 'react'
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../components/charts';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';

// db
import Dexie from 'dexie';
import { daysToWeeks } from 'date-fns';

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

const CHART_DATA = [4344, 5435, 1443, 4443];

export default function AppCurrentVisits() {

  const db = new Dexie('myDatabase');
  db.version(1).stores({
    friends: "++id,s_no, gre, tofel, ur, sop, lor, cgpa, research",
  });
  const token = localStorage.getItem("token")
  const theme = useTheme();
  const API = axios.create({
    baseURL: 'http://localhost:3001/dataset/',
    headers: {'Authorization': `Bearer ${token}`}
  });
  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ],
    labels: ['America', 'Asia', 'Europe', 'Africa'],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
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
      pie: { donut: { labels: { show: false } } }
    }
  });

  useEffect(() => {
      API.get('/')
      .then(response=>{

        // for(var data1 of response.data)
        // {
        //   // friends: "++id,s_no, gre, tofel, ur, sop, lor, cgpa, research",

        //    db.friends.add({s_no:data1[0],gre:data1[1],tofel:data1[2],ur:data1[3],sop:data1[4],lor:data1[5],cgpa:data1[6],reseach:data1[7]});
        // }

          var result=new Map();
          console.log(db.friends.toArray())
          db.friends.orderBy('gre').eachKey(date => {
            if(date!="GRE Score")
            {
              console.log(result.get("fuck"))
              result.set("fuck",1)
            }
            
          })
          console.log(result.get("fuck"))
          console.log(result)
          // setPosts(response.data);
      });
  },[])


  return (
    <Card>
      <CardHeader title="Current Visits" />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="pie" series={CHART_DATA} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
