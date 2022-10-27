import { useState } from 'react';
import ProtectedRoutes from '../../shared/guards/ProtectedRoutes'
import Login from '../Login/Login';
import Register from '../Register/Register';

import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { Callcenter } from '../Callcenter/Callcenter';

export const Main = () => {;
    return (
        <>
            <Routes>
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path='/callcenter' element={<Callcenter />} />
                </Route>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </>
    )
}