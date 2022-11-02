import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Swal from 'sweetalert2';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as LinkReact, Navigate } from "react-router-dom";
import backgroundImage from '../../shared/img/backgroundRegister.png'

const theme = createTheme();

const Register = () => {

    const [navigate, setNavigate] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [surname, setSurname] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();
        await axios.post('http://localhost:3200/worker/register', {
            name, email, password, phoneNumber, surname
        }).then((res) => {
            Swal.fire({
                icon: 'success',
                title: (res.data.message),
                confirmButtonColor: '#28B463'
            });
            setNavigate(true);
        }).catch((err) => {
            Swal.fire({
                icon: 'error',
                title: (err.response.data.message || err.response.data),
                confirmButtonColor: '#E74C3C'
            });
        });
    };

    if (navigate) {
        return <Navigate to='/login' />
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '80vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={6}
                    sx={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} sx={{ boxShadow: "none" }}>
                    <LinkReact to="/login" style={{ textDecoration: 'none', color: "inherit" }}>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{ mt: 3, mb: 2, ml: 3 }}
                        >
                            Sign In
                        </Button>
                    </LinkReact>
                    <Box
                        sx={{
                            mb: 5,
                            mt: 2,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <AddCircleIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Create Account
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                onChange={event => setName(event.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="surname"
                                label="Surname"
                                name="surname"
                                autoComplete="surname"
                                onChange={event => setSurname(event.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                type="email"
                                wasValidate
                                autoComplete="email"
                                onChange={event => setEmail(event.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={event => setPassword(event.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="phoneNumber"
                                label="Phone Number"
                                id="phoneNumber"
                                autoComplete="phoneNumber"
                                onChange={event => setPhoneNumber(event.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Register;