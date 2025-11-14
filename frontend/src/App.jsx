import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import PaperList from './pages/PaperList'
import SubmitPaper from './pages/SubmitPaper'
import SubmitReview from './pages/SubmitReview'
import Decision from './pages/Decision'
import ScheduleAdmin from './pages/ScheduleAdmin'
import ScheduleView from './pages/ScheduleView'
import AllReviews from './pages/AllReviews'
import PaymentPage from './pages/PaymentPage'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import Navbar from './components/Navbar'
import { AuthProvider } from './utils/auth'

export default function App(){
  return (
    <>
    
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/admin/login" element={<AdminLogin/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/reset-password/:token" element={<ResetPassword/>} />
            <Route path="/papers" element={<Protected><PaperList/></Protected>} />
            <Route path="/submit-paper" element={<Protected><SubmitPaper/></Protected>} />
            <Route path="/submit-review" element={<Protected><SubmitReview/></Protected>} />
            <Route path="/decision" element={<Protected><Decision/></Protected>} />
            <Route path="/schedule-admin" element={<Protected><ScheduleAdmin/></Protected>} />
            <Route path="/schedule" element={<Protected><ScheduleView/></Protected>} />
            <Route path="/all-reviews" element={<Protected><AllReviews/></Protected>} />
            <Route path="/payment" element={<PaymentPage/>} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="*" element={<Navigate to='/' />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
    </>
  )
}

function Protected({ children }){
  const token = localStorage.getItem('token')
  if(!token) return <Navigate to="/login" />
  return children
}