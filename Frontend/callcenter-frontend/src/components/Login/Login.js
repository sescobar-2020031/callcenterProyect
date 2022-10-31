import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link as LinkReact, Navigate } from "react-router-dom";
import backgroundImage from '../../shared/img/backgroundLogin.png'

const theme = createTheme();

const Login = ({logged, setLogged}) => {

  //status for each attribute in the list(update)
  const [navigate, setNavigate] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //log in a user
  const handleSubmit = async event => {
    event.preventDefault();
    await axios.post('http://localhost:3200/worker/login', {
      email, password
    }).then((res) => {
      localStorage.setItem('identity', JSON.stringify(res.data.user));
      localStorage.setItem('loggedIn', true);
      setLogged(true)
      localStorage.setItem('token', res.data.token);
      Swal.fire
        ({
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
    return <Navigate to='/homePage' />;
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
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 5 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <LinkReact to="/register" style={{ textDecoration: 'none', color: "inherit" }}>
                    {"Don't have an account? Sign Up"}
                  </LinkReact>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;