// material
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
  LineChart,
  RadarChart,
  TopBar,
} from '../sections/@dashboard/app';
import AppUploadData from '../sections/@dashboard/app/AppUploadData';
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";

import { Responsive, WidthProvider } from "react-grid-layout";
// import Button from "src/theme/overrides/Button";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

// ----------------------------------------------------------------------


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

const originalItems =["1", "2", "3", "4","5","6","7"];

const componentList = JSON.parse(localStorage.getItem('componentList')) ||{
  1: "LineChart",
  2: "RadarChart",
  3: "BarChart",
  4: "ScatterChart",
  5: "AppHeatMap",
  6: "AppExcel",
  7:"PieChart",
};

const components = {
  "LineChart": LineChart,
  "RadarChart": RadarChart,
  "BarChart": BarChart,
  "ScatterChart": ScatterChart,
  "AppHeatMap": AppHeatMap,
  "AppExcel": AppExcel,
  "AppExcel": AppExcel,
  "PieChart": PieChart
};
export default class DashboardApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
  
  // onRemoveItem = (itemId) => {
  //   this.setState((prevState) => {
  //     return { items: [...prevState.items.filter((i)=>i!==), prevState.count.toString()],count:prevState.count+1}
  //   })  
  //   setItems(items.filter((i) => i !== itemId));
  // };

  componentDidMount() {
    this.setState({ mounted: true });
    localStorage.getItem('dataURL')
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
        <TopBar onLayoutSave={this.onLayoutSave} onAddItem={this.onAddItem}/>
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
           <Widget component={components[componentList[key]]}/>
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
