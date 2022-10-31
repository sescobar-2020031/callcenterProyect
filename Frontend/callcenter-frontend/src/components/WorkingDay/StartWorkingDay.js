import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import axios from 'axios';
import token from '../../shared/userData/getToken';
import Swal from 'sweetalert2';

const StartWorkingDay = ({setInWorkDay}) => {

    const startWorkingDay = async () => {

        axios.defaults.headers.common['Authorization'] = token();
        await axios.post('http://localhost:3200/callRegister/startWorkingDay', { checkInTime: new Date().toLocaleString() })
            .then((res) => {
                Swal.fire({
                    icon: 'success',
                    title: (res.data.message),
                    confirmButtonColor: '#28B463',
                    timer: 2400
                });
                setInWorkDay(true);
            }).catch((err) => {
                Swal.fire({
                    timer: 1500,
                    icon: 'error',
                    title: (err.response.data.message || err.response.data),
                    confirmButtonColor: '#E74C3C'
                });
            });
    };

    return (
        <Box textAlign='center'>
            <Button sx={{ margin: '0.3rem', marginBottom: '3rem', backgroundColor: '#3AA444' }} color="success" variant='contained' onClick={startWorkingDay} >Start working day</Button>
        </Box>
    )

}

export default StartWorkingDay;