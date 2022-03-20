import {
  UploadData
} from '../sections/@dashboard/datasets';
import Page from '../components/Page';
import {Typography,Container} from '@mui/material';

// ----------------------------------------------------------------------

export default function DataUpload(props) {
  

  return (
    <Page title="User DataSets">
        <Container>
        <Typography variant="h4" gutterBottom>
            User DataSets
        </Typography>
        <UploadData props={props}/>
        </Container>
    </Page>
    // console.log("Hello"),
    // <div>Hello</div>    
  );
}
