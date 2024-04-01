import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from '../Pages/Signup';
import Login from '../Pages/Login';
import Navbar from '../Navbar/Navbar';
import Home from '../Pages/Home';
import Dashboard from '../Dashboard/Dashboard';
import Profile from '../Profile/Profile';
import UserBlogs from '../UserBlogs/UserBlogs';
import UserHome from '../UserBlogs/UserHome';

export default function Router() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/UserHome' element={<UserHome />} />
                    <Route path='/UserBlogs' element={<UserBlogs />} />
                    <Route path='/Navbar' element={<Navbar />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/signup/login' element={<Login />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/profile' element={<Profile />} />
                </Routes>
            </BrowserRouter>

        </div>
    )
}
