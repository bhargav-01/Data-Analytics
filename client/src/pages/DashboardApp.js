// material
import { Link as RouterLink } from 'react-router-dom';

import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Box,Button, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppExcel,
  BarChart,
  AppHeatMap,
  AppOrderTimeline,
  PieChart,
  AppWebsiteVisits,
  AppTrafficBySite,
  Widget,
  AppCurrentSubject,
  AppConversionRates,
  ScatterChart,
  LinearRegression,
  GetMean,
  GetVar,
  GetMin,
  GetMax,
  GetSum,
  LineChart,
  RadarChart,
  TopBar,
} from '../sections/@dashboard/app';
import AppUploadData from '../sections/@dashboard/app/AppUploadData';
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { UploadData } from '../sections/@dashboard/datasets';
import { motion } from 'framer-motion';
import { MotionContainer, varBounceIn } from '../components/animate';
import { styled } from '@mui/material/styles';

import { Responsive, WidthProvider } from "react-grid-layout";
import axios from 'axios'
import Iconify from '../components/Iconify';
// import Button from "src/theme/overrides/Button";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

// import { , Typography, Container } from '@mui/material';
// components
// import Page from '../components/Page';
// ----------------------------------------------------------------------
const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));


function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value
      })
    );
  }
}


function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {}
  }
  return ls[key];
}

const originalItems =["1", "2", "3", "4","5","6","7","8"];

const componentList = JSON.parse(localStorage.getItem('componentList')) ||{
  1: "LineChart",
  2: "RadarChart",
  3: "BarChart",
  4: "ScatterChart",
  5: "AppHeatMap",
  6: "AppExcel",
  7:"PieChart",
  8: "Mean",
  9: "Variance",
  10: "Minimum",
  11: "Maximum",
  12: "Sum"
};

const components = {
  "LineChart": LineChart,
  "RadarChart": RadarChart,
  "BarChart": BarChart,
  "ScatterChart": ScatterChart,
  "AppHeatMap": AppHeatMap,
  "AppExcel": AppExcel,
  "AppExcel": AppExcel,
  "PieChart": PieChart,
  "LinerRegression":LinearRegression,
  "Mean": GetMean,
  "Variance": GetVar,
  "Minimum": GetMin,
  "Maximum": GetMax,
  "Sum": GetSum
};
export default class DashboardApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDataExit:true,
      count:parseInt(localStorage.getItem('count')) ||10,
      items:JSON.parse(localStorage.getItem('originalItems'))|| originalItems,
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts:getFromLS("layouts")|| { lg: props.initialLayout },
      data: null
    };
    this.onLayoutSave=this.onLayoutSave.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onAddItem=this.onAddItem.bind(this);
    this.onRemoveItem=this.onRemoveItem.bind(this);
    this.SelectSet=this.SelectSet.bind(this);
  }

  onLayoutChange = (_, allLayouts) => {
    this.setState({layouts:allLayouts});

  };
  
  onAddItem = (itemId) => {
    componentList[this.state.count]=itemId
    this.setState((prevState) => {
      return { items: [...prevState.items, prevState.count.toString()],count:prevState.count+1}
    })  
    // console.log(componentList)
    // console.log(this.state.items)
    // this.setState({items:[...this.state.items, itemId]})
  };


  onRemoveItem = (itemId) => {
    this.setState((prevState) => {
      return { items: prevState.items.filter((i)=>i!==itemId)}
    })  
  };

  componentDidMount() {
    this.setState({ mounted: true });

    const API = axios.create({
      baseURL: 'http://localhost:3001/dataset',
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
    });

    API.get('')
    .then(response=>{
      console.log(response)
      if(response.data.message=="no dataset")
      {
        alert(response.data.message)
        this.setState({
            isDataExit:false,
        })
        // console.log(response.data)
       
      }
      else
      {
        this.setState((prevState) => {
          return { data:response.data}
        })  
      }
      // console.log("heelo",response.data);
      
    });
  }

  SelectSet=(data)=>
  {
    const API = axios.create({
      baseURL: 'http://localhost:3001/dataset',
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
    });

    API.get('/datajson', {params: {dataURL: data}})
    .then(response=>{
      console.log(response.data);
      this.setState((prevState) => {
        return { data:response.data}
      }) 
    });
    
  } 
  onLayoutSave = () => {
    saveToLS("layouts", this.state.layouts);
    localStorage.setItem("originalItems", JSON.stringify(this.state.items));
    localStorage.setItem("count", this.state.count);
    localStorage.setItem("componentList", JSON.stringify(componentList));
  };

  render(){
    return(
      <>
      {
        this.state.isDataExit==false &&
          // <RootStyle title="404 Page Not Found | Minimal-UI">
            <Container>
              <MotionContainer initial="initial" open>
                <Box sx={{ maxWidth: 480, margin: '0px auto', textAlign: 'center' }}>
                  <motion.div variants={varBounceIn}>
                    <Typography variant="h3" paragraph>
                      Upload Data!
                    </Typography>
                  </motion.div>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Sorry, we couldn???t find the any Dataset. So please upload dataser.
                  </Typography>

                  <motion.div variants={varBounceIn}>
                    <Box
                      component="img"
                      src="/static/illustrations/illustration_upload.svg"
                      sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
                    />
                  </motion.div>
                  <Button to="/dashboard/datasets" size="large" variant="contained" component={RouterLink}
                    startIcon={<Iconify icon='entypo:upload-to-cloud'/>}
                    >
                    Upload Data
                  </Button>
                </Box>
              </MotionContainer>
            </Container>
          // </RootStyle>
      }
      {
        this.state.data!=null && 
        <>
        <TopBar onLayoutSave={this.onLayoutSave} SelectSet={this.SelectSet} onAddItem={this.onAddItem}/>
          <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          measureBeforeMount={false}
          onLayoutChange={this.onLayoutChange}
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
        >
        
        {this.state.items.map((key) => (
          <Box
            key={key}
          >
           <Widget component={components[componentList[key]]} id={key} data={this.state.data} onRemoveItem={this.onRemoveItem}/>
          </Box>
        ))}
        
          {/* <Box key="1" >
          </Box>
          <Box key="2">
            <AppWeeklySales/>
          </Box>
          <Box key="3">
            <AppNewUsers />
          </Box>
          <Box key="4">
            <AppItemOrders />
          </Box>
          <Box key="5">
            <AppBugReports/>
          </Box>
          <Box key="6">
            <AppBugReports/>
          </Box>
          <Box key="7">
            <AppWebsiteVisits />
          </Box>
          <Box key="8">
            <ScatterChart />
          </Box>
          <Box key="9">
            <LineChart />
          </Box>
          <Box key="10">
            <BarChart />
          </Box>
          <Box key="11">
            <AppHeatMap/>
          </Box>
          <Box key="12">
            <AppCurrentSubject />
          </Box>
          <Box key="13">
            <AppNewsUpdate />
          </Box>
          <Box key="14">
            <AppOrderTimeline />
          </Box>
          <Box key="15">
            <AppTrafficBySite />
          </Box>
          <Box key="16">
            <AppTasks />
          </Box>
          <Box key="17">
            <AppExcel />
          </Box>
          <Box key="18">
            <AppCurrentVisits />
          </Box>
          <Box key="19">
            <RadarChart />
          </Box>
          <Box key="20">
            <AppConversionRates />
          </Box> */}
        </ResponsiveReactGridLayout>
        </>
      }
      </>
        
    )
  }

  // return (
  //   <Page title="Dashboard | Minimal-UI">
  //     <Container maxWidth="xl">
  //       <Box sx={{ pb: 5 }}>
  //         <Typography variant="h4">Hi, Welcome back</Typography>
  //       </Box>
  //       <Grid container spacing={3}>
  //         <Grid item xs={12} sm={6} md={3}>
  //           <AppUploadData />
  //         </Grid>
  //         <Grid item xs={12} sm={6} md={3}>
  //           <AppWeeklySales />
  //         </Grid>
  //         <Grid item xs={12} sm={6} md={3}>
  //           <AppNewUsers />
  //         </Grid>
  //         <Grid item xs={12} sm={6} md={3}>
  //           <AppItemOrders />
  //         </Grid>
  //         <Grid item xs={12} sm={6} md={3}>
  //           <AppBugReports />
  //         </Grid>

  //         <Grid item xs={12} md={6} lg={8}>
  //           <AppWebsiteVisits />
  //         </Grid>

  //         <Grid item xs={12} md={6} lg={8}>
  //           <ScatterChart />
  //         </Grid>
          
  //         <Grid item xs={12} md={6} lg={8}>
  //           <LineChart />
  //         </Grid>

  //         <Grid item xs={12} md={6} lg={8}>
  //           <BarChart />
  //         </Grid>
          
  //         <Grid item xs={12} md={6} lg={4}>
  //           <AppCurrentVisits />
  //         </Grid>

          
          // <Grid item xs={12} md={6} lg={4}>
          //   <RadarChart />
          // </Grid>

          // <Grid item xs={12} md={6} lg={8}>
          //   <AppConversionRates />
          // </Grid>

          
          // <Grid item xs={12} md={6} lg={8}>
          //   <AppHeatMap/>
          // </Grid>

          // <Grid item xs={12} md={6} lg={4}>
          //   <AppCurrentSubject />
          // </Grid>

          // <Grid item xs={12} md={6} lg={8}>
          //   <AppNewsUpdate />
          // </Grid>

          // <Grid item xs={12} md={6} lg={4}>
          //   <AppOrderTimeline />
          // </Grid>

          // <Grid item xs={12} md={6} lg={4}>
          //   <AppTrafficBySite />
          // </Grid>

          // <Grid item xs={12} md={6} lg={8}>
          //   <AppTasks />
          // </Grid>
          // <Grid item xs={12} md={12} lg={12}>
          //   <AppExcel />
          // </Grid>
  //       </Grid>
  //     </Container>
  //   </Page>
  // );
}


DashboardApp.propTypes = {
  onLayoutChange: PropTypes.func.isRequired
};

DashboardApp.defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function() {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: generateLayout()
};

function generateLayout() {
  return _.map(_.range(0, 25), function(item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: 0,
      y:0,
      w: 10,
      h: 10,
      i: i.toString(),
      static: false,
    };
  });
}
