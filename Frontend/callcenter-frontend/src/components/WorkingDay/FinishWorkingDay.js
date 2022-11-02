import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import axios from 'axios';
import token from '../../shared/userData/getToken';
import Swal from 'sweetalert2';

const FinishWorkingDay = ({setInWorkDay}) => {

    const finishWorkingDay = async () => {

        axios.defaults.headers.common['Authorization'] = token();
        await axios.post('https://callcenter-easygo.herokuapp.com/callRegister/finishWorkingDay', { checkOutTime: new Date().toLocaleString() })
            .then((res) => {
                Swal.fire({
                    icon: 'success',
                    title: (res.data.message),
                    confirmButtonColor: '#28B463',
                    timer: 2400
                });
                setInWorkDay(false);
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
            <Button sx={{ margin: '0.3rem', marginBottom: '3rem'}} color="error" variant='contained' onClick={finishWorkingDay}>Finish working day</Button>
        </Box>
    )

};

export default FinishWorkingDay;