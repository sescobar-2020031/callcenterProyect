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
import { Link as LinkReact } from "react-router-dom";
import { Grid } from '@mui/material';
import StartWorkingDay from '../WorkingDay/StartWorkingDay';
import FinishWorkingDay from '../WorkingDay/FinishWorkingDay';

const Homepage = () => {

    //status for callcenter

    const [laborJourneys, setJourneys] = useState([]);

    const [todaysJourneyAvailable, setTodaysJourneyAvailable] = useState(false);
    const [previousJourneyAvailable, setPreviousJourneyAvailable] = useState(false);
    const [callsAvailable, setCallsAvailable] = useState(false);
    const [inWorkDay, setInWorkDay] = useState(false);

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
                    for (let journey of res.data.journeys) {
                        if (journey.state === 'Available') setInWorkDay(true)
                    }
                    if (res.data.journeys[0].calls.length !== 0) {
                        setPreviousJourneyAvailable(true)
                    } else {
                        setPreviousJourneyAvailable(false)
                    }
                } else {
                    setPreviousJourneyAvailable(false)
                }
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
                        if (journey.state === 'Available') setInWorkDay(true)
                        if (journey.calls.length !== 0) {
                            setCallsAvailable(true);

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
                {
                    inWorkDay ?
                        <AddCall values={values} setValues={setValues} refresh={refresh} setRefresh={setRefresh} />
                        :
                        <StartWorkingDay setInWorkDay={setInWorkDay} />
                }
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
                                                    <StyledTableCell align="center">{new Date(call.call.startTime).toString().slice(0,24)}</StyledTableCell>
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
                {
                    inWorkDay ?
                        <Box textAlign='center' sx={{ mt: '1rem' }}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <LinkReact to="/previousWorkDays" style={{ textDecoration: 'none', color: "inherit"}}>
                                        <Button sx={{ margin: '0.3rem', marginBottom: '3rem' }} variant='contained'>show Table Previous Work Days</Button>
                                    </LinkReact>
                                </Grid>
                                <Grid item xs={6}>
                                    <FinishWorkingDay setInWorkDay={setInWorkDay} />
                                </Grid>
                            </Grid>
                        </Box>
                        :
                        <Box textAlign='center' sx={{ mt: '1rem' }}>
                            <LinkReact to="/previousWorkDays" style={{ textDecoration: 'none', color: "inherit", marginLeft: "auto" }}>
                                <Button sx={{ margin: '0.3rem', marginBottom: '3rem' }} variant='contained'>show Table Previous Work Days</Button>
                            </LinkReact>
                        </Box>
                }
            </div>
            : previousJourneyAvailable
                ?
                <div>
                    {
                        inWorkDay ?
                            <AddCall values={values} setValues={setValues} refresh={refresh} setRefresh={setRefresh} />
                            :
                            <StartWorkingDay setInWorkDay={setInWorkDay} />
                    }
                    <PreviousWorkDays previousJourneyAvailable={previousJourneyAvailable} />
                    {
                        inWorkDay ? 
                        <FinishWorkingDay setInWorkDay={setInWorkDay} />
                        :
                        <br />
                    }
                </div>
                :
                <div>
                    {
                        inWorkDay ?
                            <AddCall values={values} setValues={setValues} refresh={refresh} setRefresh={setRefresh} />
                            :
                            <StartWorkingDay setInWorkDay={setInWorkDay} />
                    }
                    <Typography align='center' variant="h4">You have no working days available</Typography>;
                    {
                        inWorkDay ? 
                        <FinishWorkingDay setInWorkDay={setInWorkDay} />
                        :
                        <br />
                    }
                </div>
    )
}

export default Homepage;