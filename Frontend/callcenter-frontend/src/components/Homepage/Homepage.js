import { useEffect, useState } from 'react';
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
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

const Homepage = () => {

    //status for callcenter
    const [laborJourneys, setJourneys] = useState([]);

    const [callTyping, setCallTyping] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endingTime, setEndingTime] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [IdentificationNumber, setIdentificationNumber] = useState('');
    const [additionalInformation, setAdditionalInformation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [solution, setSolution] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);

    useEffect(() => {
        const config = {
            headers: {
                Authorization: token()
            }
        }
        axios.get('http://localhost:3200/callRegister/getCallsToday', config)
            .then((res) => {
                console.log(res.data.calls)
                setJourneys(res.data.calls);
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: (err.response.data.message || err.response.data),
                    confirmButtonColor: '#E74C3C'
                });
            });
    }, []);

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

    const rows = laborJourneys.map((journey) => {
        return {
            state: journey.state,
            checkInTime: journey.checkInTime,
            checkOutTime: journey.checkOutTime,
            calls: journey.calls
        }
    });

    return (
        <div>
            <TableContainer component={Paper} sx={{ marginTop: '3%' }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">State</StyledTableCell>
                            <StyledTableCell align="center">Check In Time</StyledTableCell>
                            <StyledTableCell align="center">Check Out Time</StyledTableCell>
                            <StyledTableCell align="center">Call Numbers</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.Id} >
                                <StyledTableCell align="center"> {row.state} </StyledTableCell>
                                <StyledTableCell align="center">{new Date(row.checkInTime).toString().slice(0,24)}</StyledTableCell>
                                {
                                    row.checkOutTime ? <StyledTableCell align="center">{new Date(row.checkOutTime).toString().slice(0,24)}</StyledTableCell>
                                    : <StyledTableCell align="center" sx={{fontSize: '3rem'}}>Work day in progress</StyledTableCell>
                                }
                                {
                                    <StyledTableCell align="center">{row.calls.length}</StyledTableCell>
                                }
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Homepage;