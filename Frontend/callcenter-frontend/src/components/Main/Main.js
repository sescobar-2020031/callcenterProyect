import React, {useState} from 'react';
import ProtectedRoutes from '../../shared/guards/ProtectedRoutes'
import Header from '../Header/Header';
import Login from '../Login/Login';
import Register from '../Register/Register';
import HomePage from '../Homepage/Homepage'

import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";


export const Main = () => {
    const [logged, setLogged] = useState(false)
    return (
        <>
            <div style={{ marginBottom: '10vh'}}>
                <Header logged={logged} setLogged={setLogged}   />
            </div>
            <Routes>
                <Route exact path="/login" element={<Login logged={logged} setLogged={setLogged} />} />
                <Route exact path="/register" element={<Register />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path='/homePage' element={<HomePage />} />
                </Route>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </>
    )
}