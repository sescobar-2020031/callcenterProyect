import { useEffect, useState } from 'react';
import AddCall from '../Calls/AddCall';
import axios from 'axios';
import Swal from 'sweetalert2';
import token from '../../shared/userData/getToken';
import PreviousWorkDays from '../PreviousWorkDays/PreviousWorkDays';
import { Button } from "@mui/material";
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link as LinkReact, Navigate } from "react-router-dom";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

const Homepage = () => {

    //status for callcenter
    const [navigate, setNavigate] = useState(false);

    const [laborJourneys, setJourneys] = useState([]);
    const [previousLaborJourneys, setPreviousLaborJourneys] = useState([]);

    const [todaysJourneyAvailable, setTodaysJourneyAvailable] = useState(false);
    const [previousJourneyAvailable, setPreviousJourneyAvailable] = useState(false);
    const [callsAvailable, setCallsAvailable] = useState(false);

    const [refresh, setRefresh] = useState(0);

    const [values, setValues] = useState({
        callTyping: "",
        startTime: "",
        endingTime: "",
        name: "",
        surname: "",
        identificationNumber: 0,
        additionalInformation: "",
        contactNumber: 0,
        solution: "",
    })

    const getPreviousWorkingDays = async () => {
        axios.get('http://localhost:3200/callRegister/getAllCalls', { headers: { Authorization: token() } })
            .then((res) => {
                if (res.data.journeys.length !== 0) {
                    if (res.data.journeys[0].calls.length !== 0) {
                        setPreviousJourneyAvailable(true)
                    } else {
                        setPreviousJourneyAvailable(false)
                    }
                } else {
                    setPreviousJourneyAvailable(false)
                }
                setPreviousLaborJourneys(res.data.journeys);
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: (err.response.data.message || err.response.data),
                    confirmButtonColor: '#E74C3C'
                });
            });
    }

    useEffect(() => {
        axios.get('http://localhost:3200/callRegister/getCallsToday', { headers: { Authorization: token() } })
            .then((res) => {
                if (res.data.journeys.length !== 0) {
                    for (let journey of res.data.journeys) {
                        if (journey.calls.length !== 0) {
                            setCallsAvailable(true)

                        } else {
                            setCallsAvailable(false)
                            getPreviousWorkingDays();
                        }
                    }
                    setTodaysJourneyAvailable(true)
                } else {
                    setTodaysJourneyAvailable(false);
                    getPreviousWorkingDays();
                }
                setJourneys(res.data.journeys);
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: (err.response.data.message || err.response.data),
                    confirmButtonColor: '#E74C3C'
                });
            });
    }, [refresh]);

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
        todaysJourneyAvailable && callsAvailable ?
            <div>
                <AddCall values={values} setValues={setValues} refresh={refresh} setRefresh={setRefresh} />
                <Typography align='center' variant="h4">Today's calls</Typography>;
                <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Table sx={{ minWidth: 700, width: '90%' }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Call Typing</StyledTableCell>
                                <StyledTableCell align="center">Start Time</StyledTableCell>
                                <StyledTableCell align="center">Ending Time</StyledTableCell>
                                <StyledTableCell align="center">Duration</StyledTableCell>
                                <StyledTableCell align="center">Contact Number</StyledTableCell>
                                <StyledTableCell align="center">Solution</StyledTableCell>
                                <StyledTableCell align="center">Name of individual</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {
                            rows.map((row) => {
                                return (
                                    row.calls.map((call) => {
                                        return (
                                            <TableBody>
                                                <StyledTableRow key={call.call._id} >
                                                    <StyledTableCell align="center">{call.call.callTyping}</StyledTableCell>
                                                    <StyledTableCell align="center">{new Date(call.call.startTime).toString().slice(0, 24)}</StyledTableCell>
                                                    <StyledTableCell align="center">{new Date(call.call.endingTime).toString().slice(0, 24)}</StyledTableCell>
                                                    <StyledTableCell align="center">{call.call.duration}</StyledTableCell>
                                                    <StyledTableCell align="center">{call.call.contactNumber}</StyledTableCell>
                                                    <StyledTableCell align="center">{call.call.solution}</StyledTableCell>
                                                    <StyledTableCell align="center">{call.call.contactDescription.name}</StyledTableCell>
                                                </StyledTableRow>
                                            </TableBody>
                                        )
                                    })
                                )
                            })
                        }
                    </Table>
                </TableContainer>
                <Box textAlign='center' sx={{mt: '1rem'}}>
                    <LinkReact to="/previousWorkDays" style={{ textDecoration: 'none', color: "inherit", marginLeft: "auto" }}>
                        <Button sx={{ margin: '0.3rem', marginBottom: '3rem' }} variant='contained'>show Table Previous Work Days</Button>
                    </LinkReact>
                </Box>
            </div>
            : previousJourneyAvailable
                ?
                <div>
                    <AddCall values={values} setValues={setValues} refresh={refresh} setRefresh={setRefresh} />
                    <PreviousWorkDays values={values} setValues={setValues} refresh={refresh} setRefresh={setRefresh} previousLaborJourneys={previousLaborJourneys} setPreviousLaborJourneys={setPreviousLaborJourneys} setPreviousJourneyAvailable={setPreviousJourneyAvailable} />
                </div>
                :
                <div>
                    <AddCall values={values} setValues={setValues} refresh={refresh} setRefresh={setRefresh} />
                    <Typography align='center' variant="h4">You have no working days available</Typography>;
                </div>
    )
}

export default Homepage;