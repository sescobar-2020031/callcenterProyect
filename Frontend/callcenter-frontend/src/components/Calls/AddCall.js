import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import Swal from 'sweetalert2';
import token from '../../shared/userData/getToken';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Grid } from '@mui/material';

//style for a modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const AddCall = ({ values, setValues, refresh, setRefresh }) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const startTime = () => {
        setValues({ ...values, 'startTime': new Date().toLocaleString() })
    };

    const endingTime = () => {
        setValues({ ...values, 'endingTime': new Date().toLocaleString() })
    };

    //make the request to the API and save
    const addCall = async (event) => {

        event.preventDefault();

        axios.defaults.headers.common['Authorization'] = token();

        await axios.post('http://localhost:3200/call/saveCall', values)
            .then((res) => {
                Swal.fire({
                    icon: 'success',
                    title: (res.data.message),
                    confirmButtonColor: '#28B463',
                    timer: 2400
                });
                setRefresh(refresh + 1);
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
        <div>
            <Box textAlign='center'>
                <Button sx={{ margin: '0.3rem', marginBottom: '3rem' }} variant='contained' onClick={() => { handleOpen(); startTime(); }}>Add Call</Button>
            </Box>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box sx={style} component="form" noValidate onSubmit={addCall}>
                        <Typography sx={{fontSize: '1.5rem', mt: '0.5rem'}} align='center'>
                            Add Call
                        </Typography>
                        <FormControl sx={{ m: 1 }} fullWidth>
                            <InputLabel id="statusText">Call Typing</InputLabel>
                            <Select
                                labelId="callTyping"
                                id="callTyping"
                                name='callTyping'
                                onChange={onChange}
                                autoWidth
                                label="Call Typing"
                            >
                                <MenuItem value={'New Sale'}>New sale</MenuItem>
                                <MenuItem value={'Sale for renovation'}>Sale for renovation</MenuItem>
                                <MenuItem value={'Sale not completed'}>Sale not completed,</MenuItem>
                                <MenuItem value={'Sale does not meet the requirement'}>Sale does not meet the requirement</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography sx={{fontSize: '1.3rem', mt: '0.5rem'}} align='center'>
                            Contact Description
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="name"
                                    name="name"
                                    autoFocus
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="surname"
                                    label="surname"
                                    name="surname"
                                    onChange={onChange}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="identificationNumber"
                                    label="identificationNumber"
                                    name="identificationNumber"
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="contactNumber"
                                    label="contactNumber"
                                    name="contactNumber"
                                    onChange={onChange}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="additionalInformation"
                            label="additionalInformation"
                            name="additionalInformation"
                            onChange={onChange}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="solution"
                            label="solution"
                            name="solution"
                            onChange={onChange}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => { handleClose(); endingTime() }}
                        >
                            Save
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
};

export default AddCall;