import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import UserPortfolio from './pages/UserPortfolio'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="portfolio/:userId" element={<UserPortfolio />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
