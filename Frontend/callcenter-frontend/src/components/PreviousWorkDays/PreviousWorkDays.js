import { useEffect, useState } from 'react';
import { Link as LinkReact } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
import token from '../../shared/userData/getToken';
import { Button } from "@mui/material";
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useNavigate } from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const PreviousWorkDays = ({ previousJourneyAvailable }) => {

    const [previousLaborJourneys, setPreviousLaborJourneys] = useState([]);
    const [searchByDate, setSearchByDate] = useState('');

    const [searchResult, setSearchResult] = useState(false);
    const [reloadSearch, setReloadSearch] = useState(false);

    const navigate = useNavigate();

    const workdayCalls = (idWorkday) => {
        navigate('/workdayCalls', { state: { idProps: idWorkday } });
    }

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
    }, [reloadSearch])

    const reload = () => {
        setReloadSearch(!reloadSearch);
        setSearchResult(false);
        setSearchByDate(null);
    }

    const previousWorkDays = async () => {

        axios.defaults.headers.common['Authorization'] = token();

        let data = {
            date: searchByDate
        }

        await axios.post('http://localhost:3200/callRegister/getCallsByDate', data)
            .then((res) => {
                setPreviousLaborJourneys(res.data.calls);
                setSearchResult(true);
            }).catch((err) => {
                Swal.fire({
                    timer: 1500,
                    icon: 'error',
                    title: (err.response.data.message || err.response.data),
                    confirmButtonColor: '#E74C3C'
                });
            });
    };

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
            {
                previousJourneyAvailable ?
                    <br />
                    :
                    <LinkReact to="/homePage" style={{ textDecoration: 'none', color: "inherit" }}>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{ mt: 3, mb: 2, ml: 3 }}
                        >
                            Home
                        </Button>
                    </LinkReact>
            }
            <Typography align='center' variant="h4">Previous Work Days</Typography>;
            <Box textAlign='center' sx={{ mb: '2rem' }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        label="Search By Date"
                        value={searchByDate}
                        maxDate={new Date()}
                        onChange={(newValue) => {
                            setSearchByDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                {
                    searchResult ?
                        <IconButton onClick={() => { reload() }} aria-label="search" >
                            <CloseIcon sx={{ fontSize: '40px' }} />
                        </IconButton>
                        :
                        <IconButton onClick={() => { previousWorkDays() }} aria-label="search" color="success">
                            <SearchIcon sx={{ fontSize: '40px' }} />
                        </IconButton>
                }
            </Box>

            {
                previousLaborJourneys.length !== 0 ?
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
                                previousLaborJourneys.map((journey, index) => {
                                    return (
                                        <TableBody key={index}>
                                            <StyledTableRow key={journey._id} >
                                                <StyledTableCell align="center">Journey {journey.checkInTime.slice(0, 10)}</StyledTableCell>
                                                <StyledTableCell align="center">Journey {journey.state}</StyledTableCell>
                                                <StyledTableCell align="center">{new Date(journey.checkInTime).toJSON().slice(0, 10) + ' ' + new Date(journey.checkInTime).toJSON().slice(11, 19)} </StyledTableCell>
                                                {
                                                    journey.checkOutTime ?
                                                        <StyledTableCell align="center">{new Date(journey.checkOutTime).toJSON().slice(0, 10) + ' ' + new Date(journey.checkOutTime).toJSON().slice(11, 19)}</StyledTableCell>
                                                        :
                                                        <StyledTableCell align="center">Active working day</StyledTableCell>
                                                }
                                                <StyledTableCell align="center">{journey.calls.length}</StyledTableCell>
                                                <StyledTableCell align="center"><Button sx={{ color: '#000000' }} onClick={() => workdayCalls(journey._id)} startIcon={<ContactPhoneIcon />}>Calls</Button>,</StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    )
                                })
                            }
                        </Table>
                    </TableContainer>
                    : <><br /><br />
                        <Typography align='center' variant="h4">You have no work days available on this date</Typography>
                    </>
            }
        </div>
    )
}

export default PreviousWorkDays