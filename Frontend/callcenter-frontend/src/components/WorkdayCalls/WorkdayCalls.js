import { useLocation } from 'react-router-dom';
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
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

//style for a modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '43%',
    ['@media (max-width:780px)']: { width: '80%' },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  

const WorkdayCalls = () => {

    const [workdayCalls, setWorkdayCalls] = useState([]);
    const [title, setTitle] = useState('');

    const [call, setCall] = useState({
        contactDescription: {
            name: '',
            surname: '',
            identificationNumber: '',
            additionalInformation: ''
        },
        callTyping: '',
        startTime: '',
        endingTime: '',
        duration: '',
        contactNumber: '',
        solution: ''
    });

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const location = useLocation();

    useEffect(() => {
        axios.get(`http://localhost:3200/callRegister/getCallsById/${location.state.idProps}`, { headers: { Authorization: token() } })
            .then((res) => {
                setWorkdayCalls(res.data.journey.calls)
                setTitle(res.data.journey.checkInTime.slice(0, 10))
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: (err.response.data.message || err.response.data),
                    confirmButtonColor: '#E74C3C'
                });
            });
    }, []);

    const callDetail = (id) => {
        axios.get(`http://localhost:3200/call/getCall/${id}`, { headers: { Authorization: token() } })
            .then((res) => {
                setCall(res.data.call);
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: (err.response.data.message || err.response.data),
                    confirmButtonColor: '#E74C3C'
                });
            });
    }

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
        <>
            <Grid container spacing={0}>
                <Grid item xs={0}>
                    <LinkReact to="/homePage" style={{ textDecoration: 'none', color: "inherit" }}>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{ mt: 3, mb: 4, ml: 3 }}
                        >
                            Home
                        </Button>
                    </LinkReact>
                </Grid>
                <Grid item xs={6}>
                    <LinkReact to="/previousWorkDays" style={{ textDecoration: 'none', color: "inherit" }}>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{ mt: 3, mb: 4, ml: 3 }}
                        >
                            Previous Work Days
                        </Button>
                    </LinkReact>
                </Grid>
            </Grid>
            <Typography align='center' variant="h4">Workday {title} Calls</Typography>;
            {
                workdayCalls.length !== 0 ?
                    <TableContainer sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Table sx={{ minWidth: 700, width: '90%' }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Call Typing</StyledTableCell>
                                    <StyledTableCell align="center">Start Time</StyledTableCell>
                                    <StyledTableCell align="center">Ending Time</StyledTableCell>
                                    <StyledTableCell align="center">Duration</StyledTableCell>
                                    <StyledTableCell align="center">View Details</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            {
                                workdayCalls.map((call, index) => {
                                    return (
                                        <TableBody key={index}>
                                            <StyledTableRow key={call.call._id} >
                                                <StyledTableCell align="center">{call.call.callTyping}</StyledTableCell>
                                                <StyledTableCell align="center">{new Date(call.call.startTime).toJSON().slice(0, 10) + ' ' + new Date(call.call.startTime).toJSON().slice(11, 19)} </StyledTableCell>
                                                <StyledTableCell align="center">{new Date(call.call.endingTime).toJSON().slice(0, 10) + ' ' + new Date(call.call.endingTime).toJSON().slice(11, 19)} </StyledTableCell>
                                                <StyledTableCell align="center">{call.call.duration}</StyledTableCell>
                                                <StyledTableCell align="center"><Button sx={{ color: '#000000' }} onClick={() => { handleOpen(); callDetail(call.call._id); }} startIcon={<ContactPhoneIcon />}>Details</Button></StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    )
                                })
                            }
                        </Table>
                    </TableContainer> :
                    <>
                        <hr /><br /><br />
                        <Typography align='center' variant="h4">You have no calls</Typography>
                    </>
            }
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box sx={style} component="form" noValidate>
                        <Typography sx={{ fontSize: '1.5rem', mt: '0.5rem' }} align='center'>
                            Call Detail
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    disabled
                                    value={call.callTyping}
                                    id="callTyping"
                                    label="Call Typing"
                                    name="callTyping"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    disabled
                                    value={call.contactNumber}
                                    id="contactNumber"
                                    label="Contact Number"
                                    name="contactNumber"
                                    autoFocus
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    disabled
                                    value={call.startTime.slice(0, 10) + ' ' + call.startTime.slice(11, 19)}
                                    id="startTime"
                                    label="Start Time"
                                    name="startTime"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    disabled
                                    value={call.endingTime.slice(0, 10) + ' ' + call.endingTime.slice(11, 19)}
                                    id="endingTime"
                                    label="Ending Time"
                                    name="endingTime"
                                    autoFocus
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            margin="normal"
                            fullWidth
                            disabled
                            value={call.duration}
                            id="duration"
                            label="Duration"
                            name="duration"
                            autoFocus
                        />

                        <Typography sx={{ fontSize: '1.3rem', mt: '0.5rem' }} align='center'>
                            Contact Description
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    disabled
                                    value={call.contactDescription['name']}
                                    id="name"
                                    label="Name"
                                    name="name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    disabled
                                    value={call.contactDescription['surname']}
                                    id="surname"
                                    label="Surname"
                                    name="surname"
                                    autoFocus
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            margin="normal"
                            fullWidth
                            disabled
                            value={call.contactDescription['identificationNumber']}
                            id="identificationNumber"
                            label="Identification Number"
                            name="identificationNumber"
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            disabled
                            value={call.contactDescription['additionalInformation']}
                            id="additionalInformation"
                            label="Additional Information"
                            name="additionalInformation"
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            disabled
                            value={call.solution}
                            id="solution"
                            label="Solution"
                            name="solution"
                        />
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default WorkdayCalls;