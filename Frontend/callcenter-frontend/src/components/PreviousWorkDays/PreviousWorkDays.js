import { useEffect, useState } from 'react';
import AddCall from '../Calls/AddCall';
import axios from 'axios';
import Swal from 'sweetalert2';
import token from '../../shared/userData/getToken';
import { Button } from "@mui/material";
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

const PreviousWorkDays = () => {

    const [previousLaborJourneys, setPreviousLaborJourneys] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3200/callRegister/getAllCalls', { headers: { Authorization: token() } })
            .then((res) => {
                setPreviousLaborJourneys(res.data.journeys);
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: (err.response.data.message || err.response.data),
                    confirmButtonColor: '#E74C3C'
                });
            });
    }, [])


    //styles for the table
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <div>
            <Typography align='center' variant="h4">Previous Work Days</Typography>;
            <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
                <Table sx={{ minWidth: 700, width: '90%' }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Journey</StyledTableCell>
                            <StyledTableCell align="center">State</StyledTableCell>
                            <StyledTableCell align="center">Check In Time</StyledTableCell>
                            <StyledTableCell align="center">Check Out Time</StyledTableCell>
                            <StyledTableCell align="center">Calls Number</StyledTableCell>
                            <StyledTableCell align="center">Call Log</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {
                        previousLaborJourneys.map((journey) => {
                            return (
                                <TableBody>
                                    <StyledTableRow key={journey._id} >
                                        <StyledTableCell align="center">Journey {journey.checkInTime.slice(0, 10)}</StyledTableCell>
                                        <StyledTableCell align="center">Journey {journey.state}</StyledTableCell>
                                        <StyledTableCell align="center">{new Date(journey.checkInTime).toString().slice(0, 24)}</StyledTableCell>
                                        <StyledTableCell align="center">{new Date(journey.checkOutTime).toString().slice(0, 24)}</StyledTableCell>
                                        <StyledTableCell align="center">{journey.calls.length}</StyledTableCell>
                                        <StyledTableCell align="center"><Button sx={{ color: '#000000' }} startIcon={<ContactPhoneIcon />}>Calls</Button>,</StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )
                        })
                    }
                </Table>
            </TableContainer>
        </div>
    )
}

export default PreviousWorkDays