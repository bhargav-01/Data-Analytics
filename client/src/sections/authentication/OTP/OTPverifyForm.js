import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from 'axios'

// material
import {
  Link,
  Stack,
  Checkbox,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import OtpInput from "react-otp-input";
// component
import "./style.css";
import Iconify from '../../../components/Iconify';
import OTPInput, { ResendOTP } from "otp-input-react";

// ----------------------------------------------------------------------


export default function OTPverifyForm() {
  const navigate = useNavigate();

  const handleSubmit= () => {
    // alert(OTP)
    axios.post('http://localhost:3001/users/verification',{
      email:email,
      otp: OTP,
    })
    .then(response=>{
        localStorage.setItem('token',response.data.token);
        navigate('/dashboard/app', { replace: true });
    })
    .catch(error => {
        alert(error);
    });
  }

  const [OTP, setOTP] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div>
        <Stack spacing={3}>
          
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)} 
          />

          <OTPInput 
            value={OTP} 
            onChange={setOTP} 
            autoFocus 
            OTPLength={4} 
            otpType="number" 
            disabled={false} 
            inputStyles={{
              width: "3rem",
              height: "3rem",
              margin: "0 1rem",
              fontSize: "2rem",
              borderRadius: 4,
              border: "1px solid rgba(0,171,85,1)",
              onfocus:"border: \"1px solid rgba(0,171,85,1)\"",
              color: "black"
            }}
          />

        
        </Stack>

       
        <Button
          fullWidth
          size="large"
          type="submit"
          sx={{marginTop:"15px"}}
          variant="contained"
          onClick={handleSubmit}
        >
          Verify
        </Button>
      </div>
  );
}
