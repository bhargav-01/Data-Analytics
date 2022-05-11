import { useEffect, useState, useRef } from 'react'
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
//ML
import * as tf from '@tensorflow/tfjs'
// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, IconButton, Card, CardHeader, Container, MenuItem, TextField, Typography, Stack } from '@mui/material';
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

export default function LinearRegression(props) {

    const token = localStorage.getItem("token")
    const theme = useTheme();
    const API = axios.create({
        baseURL: 'http://localhost:3001/dataset/',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    // const [data, setData] = useState(null)
    const [selectx, setselectX] = useState(null)
    const [selecty, setselectY] = useState(null)
    const [chartData, setChartData] = useState(null)
    const [label, setLabel] = useState(null)
    const [options, setOptions] = useState(null)
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({
        optimizer: tf.train.sgd(0.1),
        loss: "meanSquaredError",
        metrics: [tf.metrics.meanAbsoluteError]
    });

    const setChart = (xheader, yheader) => {
        setChartData(null);
        // console.log(xheader,yheader)
        var temp = props.data.data
        var mapped = _.map(temp, _.partialRight(_.pick, [xheader, yheader]));
        var data = []
        for (var [key, value] of Object.entries(mapped)) {
            data.push([value[xheader],  value[yheader] ])
        }

        
        // console.log("rr1",values)
        const inputs = data.map(d => d[0]);
        const labels = data.map(d => d[1]);
        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        // model.compile({
        //     optimizer: tf.train.adam(),
        //     loss: tf.losses.meanSquaredError,
        //     metrics: ['mse'],
        // });
       

        const batchSize = 32;
        const epochs = 100;

        model.fit(normalizedInputs, normalizedLabels, {
            batchSize,
            epochs,
            shuffle: true,
        }).then(() => {
            // console.log("I am ML")
            var ans = model.predict(normalizedInputs);
            var y = ans.mul(labelMax.sub(labelMin)).add(labelMin).dataSync()
            var x = data.map(d => d[0]);
            var ml = [];
            var i = 0;
            while (i < y.length) {
                ml.push([x[i], y[i]]);
                // console.log(i)
                i++;
            }
            ml.sort(function(a,b){return a[0]-b[0]})
            data.sort(function(a,b){return a[0]-b[0]})
            //   console.log(ml)
            var series = [{ name: 'Real Values', type: 'scatter', data: data }, { name: 'Predicted Values', type: 'line', data: ml }];
            // console.log(series)
            setChartData(series)
        })

    }

    useEffect(() => {
        if (props.data != null) {
            var temp = props.data.data
            setselectX(props.data.header[0]);
            setselectY(props.data.header[1]);
            // // setChartData(t2);
            setOptions(props.data.header)
            setChart(props.data.header[0], props.data.header[1]);
        }
    }, [props.data]);


    const handelchangeX = (e) => {
        setselectX(e.target.value);
        setChart(e.target.value, selecty);
    }

    const handelchangeY = (e) => {
        setselectY(e.target.value);
        setChart(selectx, e.target.value);
    }


    const option = {
        chart: {
            height: 350,
            type: 'line',
        },
        fill: {
            type: 'solid',
        },
        markers: {
            size: [6, 0]
        },
        legend: {
            show: true
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
                  return `${y}`;
                }
                return y;
              }
            }
          }
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title="Linear Regression"
                action={
                    <IconButton aria-label="settings" onClick={() => props.onRemoveItem(props.id)}>
                        < Iconify icon="iconoir:cancel" />
                    </IconButton>
                } />
            <Container>
                {/* <Stack direction="row" alignItems="center"  mb={5}> */}
                {/* <Typography variant="h5" gutterBottom>
                X
                </Typography> */}

                {options != null && <TextField select label='X Axis' size="small" value={selectx} onChange={(e) => handelchangeX(e)}  >
                    {options.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>}

                {options != null && <TextField select size="small" sx={{ marginLeft: "10px" }} label=' Y Axis' value={selecty} onChange={(e) => handelchangeY(e)}  >
                    {options.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>}
                {/* </Stack> */}
                {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h5" gutterBottom>
                Y
                </Typography>
                
            
            </Stack> */}
            </Container>
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                {chartData != null && <ReactApexChart options={option} series={chartData} height={350} />}
            </Box>
        </Card>
    );
}
