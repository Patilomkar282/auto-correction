/* eslint-disable no-unused-vars */

// import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppContext } from '../AppContext';
import { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SlideUpPage from '../components/SlideUp';
// import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();
// const Navigate = useNavigate();
export default function Login() {
  const { setUserRole } = useContext(AppContext);
  const contextValue = useContext(AppContext);
console.log("AppContext inside Login:", contextValue);

  console.log(setUserRole);
  const navigate = useNavigate();
  // const [isVisible, setIsVisible] = useState(true); // The state is now in the parent
  const [isSlidingUp, setIsSlidingUp] = useState(false);

  const handleSlideUp = () => {
    setIsSlidingUp(true);
  };

  useEffect(() => {
    const handleClick = (event) => {
      console.log('Clicked:', event);
      handleSlideUp();
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keypress', handleKeyPress);
    };

    const handleKeyPress = (event) => {
      console.log('Key Pressed:', event.key);
      handleSlideUp();
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keypress', handleKeyPress);
    };

    // Add event listeners
    window.addEventListener('click', handleClick);
    window.addEventListener('keypress', handleKeyPress);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  const {a,b,userCredentials,setUserCredentials} = useContext(AppContext)

  if (userCredentials) {
      return <Navigate to="/" />
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const information = {
      username: data.get('email'), // Directly store as an object
      password: data.get('password'),
      
    };
    localStorage.setItem("username",information.username)

    async function login() {
        const response = await fetch('http://localhost:3006/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(information) 
            // Stringify before sending
        });

        if (!response.ok) {
            alert('Error: ' + response.statusText);
        } else {
            const data = await response.json();
            setUserRole(data.role);
            console.log("role:", data.role);

            if (data["success"]) {
                const userData = { session: data["session"], role: data.role };
                localStorage.setItem("token", JSON.stringify(userData.session));
                localStorage.setItem("role", JSON.stringify(userData.role));
                setUserCredentials(userData);

                
                await fetch('http://localhost:3006/logindetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    
                    body: JSON.stringify({ username: information.username }) 
                });

                // Redirect based on role
                if (data.role === "operator") {
                    navigate("/operator");
                } else {
                    navigate("/");
                }
            } else {
                alert('INVALID CREDENTIALS');
            }
        }
    }
    await login();
};



  return (<>
    <SlideUpPage isSlidingUp={isSlidingUp} />
    <ThemeProvider theme={defaultTheme} classNameclassName={`login-page ${userCredentials ? 'slide-up' : ''}`}>
      <Container component="main" maxWidth="xs" bgcolor="background.paper">
        <CssBaseline />
        <Box
          sx={() => ({
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#fff !important',
            ['& .MuiBox-root']: {
              bgcolor: '#fff !important',
          }
          })}
        >
           {/* <img className='mb-4' src="../../public/athenalogo.jpg" height={"60vh"}></img>   */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <h2 className='text-center text-muted' style={{fontWeight: 'bold', fontFamily: 'system-ui'}}> LOGIN</h2>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username"
              name="email"
              autoComplete="username"
              autoFocus
              color='error'
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
              color='error'
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="error" />}
              label="Remember me"
              
            />
            <Button 
              type="submit"
              fullWidth
              variant="contained"
              color='error'
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
       
      </Container>
    </ThemeProvider>

  </>
  );
}