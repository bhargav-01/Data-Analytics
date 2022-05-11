import React from "react";
import { Button, IconButton,Card,Menu,MenuItem} from '@mui/material';
// import {makeStyles} from '@mui/material/styles/'
import Iconify from "src/components/Iconify";
import SelectDataSet from "./SelectDataSet";
const options = [
  "LineChart",
  "RadarChart",
  "BarChart",
  "ScatterChart",
  "AppHeatMap",
  "AppExcel",
  "PieChart",
  "LinerRegression"
];

export default function TopBar({
  onAddItem,
  onLayoutSave,
  SelectSet
}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (e) => {
    e.preventDefault();
    console.log(e.target.textContent)
    onAddItem(e.target.textContent)
    setAnchorEl(null);
  };

  return (
    <Card sx={{width: "100%",display: "flex",justifyContent: "flex-end"}}>
   
       <SelectDataSet SelectSet={SelectSet} />
       <div style={{"margin":"auto 0 auto auto"}}>
        <Button
            variant="contained"
            component="span"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            startIcon={<Iconify icon="eva:plus-fill" />}>
          Add Chart
        </Button>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: '20ch',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option} onClick={handleSelect}>
              {option}
            </MenuItem>
          ))}
        </Menu>
        <IconButton aria-label="save" type="submit" onClick={()=>onLayoutSave()}>
          <Iconify icon={'entypo:save'}/>
        </IconButton>
    </div>
      
    </Card>
  );
}
