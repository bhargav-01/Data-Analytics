import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import axios from 'axios';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [data1,SetData1]=useState(null);
  const setData=(data) => {
      SetData1(data)
      console.log(data1)
  }

  const [profile,setProfile]=useState(null);
  const [isLoding,setLoding]=useState(true);
  
  const API = axios.create({
    baseURL: 'http://localhost:3001/',
    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
 });
  useEffect(()=>{
    setLoding(false)
    API.get('/dataset')  
    .then(response=>{setData(response.data)})

    API.get('/users')  
    .then(response=>{setProfile(response.data)})
    
    setLoding(true)
  },[])
  return (
    <RootStyle>
      {isLoding==false && 
        <div>
          <h1>Hi hello</h1>
        </div>
      }
      {
        isLoding==true &&
        <>
         <DashboardNavbar onOpenSidebar={() => setOpen(true)} profile={profile} />
         <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} profile={profile}/>
         <MainStyle>
           <Outlet />
         </MainStyle>
         </>
      }
     
    </RootStyle>
  );
}
