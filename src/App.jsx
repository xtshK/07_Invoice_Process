import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import UserPortfolio from './pages/UserPortfolio'
import Login from './pages/Login'
import Register from './pages/Register'
import FreshserviceImport from './pages/FreshserviceImport'
import UserManagement from './pages/UserManagement'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="portfolio/:userId" element={<UserPortfolio />} />
                    <Route path="import" element={<FreshserviceImport />} />
                    <Route path="users" element={<UserManagement />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
