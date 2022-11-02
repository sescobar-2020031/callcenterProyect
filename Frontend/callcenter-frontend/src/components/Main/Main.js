import React, { useState } from 'react';
import ProtectedRoutes from '../../shared/guards/ProtectedRoutes'
import UnProtectedRoutes from '../../shared/guards/UnProtectedRoutes'
import Header from '../Header/Header';
import Login from '../Login/Login';
import Register from '../Register/Register';
import HomePage from '../Homepage/Homepage'
import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import PreviousWorkDays from '../PreviousWorkDays/PreviousWorkDays';
import WorkdayCalls from '../WorkdayCalls/WorkdayCalls';


export const Main = () => {
    const [logged, setLogged] = useState(localStorage.getItem('loggedIn'));
    return (
        <>
            <div style={{ marginBottom: '10vh' }}>
                <Header logged={logged} setLogged={setLogged} />
            </div>
            <Routes>
                <Route element={<UnProtectedRoutes />}>
                    <Route exact path="/login" element={<Login logged={logged} setLogged={setLogged} />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Route>
                <Route element={<ProtectedRoutes />}>
                    <Route path='/homePage' element={<HomePage />} />
                    <Route path='/previousWorkDays' element={<PreviousWorkDays />} />
                    <Route path='/workdayCalls' element={<WorkdayCalls />} />
                    <Route path='/' element={<HomePage />} />
                    <Route path="*" element={<Navigate to="/homePage" replace />} />
                </Route>
            </Routes>
        </>
    )
};