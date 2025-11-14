import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const userName = localStorage.getItem('userName')
  const userEmail = localStorage.getItem('userEmail')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md rounded-b-xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold tracking-wider hover:text-yellow-300 transition">
          ConferenceMS
        </Link>

        <div className="flex items-center space-x-5 font-medium">
          
          {/* Always Visible */}
          <Link className="hover:text-yellow-300 transition" to="/">Home</Link>
          
          {/* Register link - only show when not logged in */}
          {!token && (
            <Link className="hover:text-yellow-300 transition" to="/payment">Register</Link>
          )}

          {/* Role-based navigation */}
          {token && (
            <>
              {/* Admin: Home, Papers, Decisions, Schedule, Logout */}
              {role === 'Admin' && (
                <>
                  <Link className="hover:text-yellow-300 transition" to="/papers">Papers</Link>
                  <Link className="hover:text-yellow-300 transition" to="/decision">Decisions</Link>
                  <Link className="hover:text-yellow-300 transition" to="/schedule-admin">Schedule</Link>
                  <Link className="hover:text-yellow-300 transition" to="/all-reviews">All Reviews</Link>
                </>
              )}

              {/* Reviewer: Home, Papers, Submit Review, Logout */}
              {role === 'Reviewer' && (
                <>
                  <Link className="hover:text-yellow-300 transition" to="/papers">Papers</Link>
                  <Link className="hover:text-yellow-300 transition" to="/submit-review">Submit Review</Link>
                </>
              )}

              {/* Author: Home, Submit Paper, Logout */}
              {role === 'Author' && (
                <Link className="hover:text-yellow-300 transition" to="/submit-paper">Submit Paper</Link>
              )}

              {/* Participant: Home, Schedule, Logout */}
              {role === 'Participant' && (
                <Link className="hover:text-yellow-300 transition" to="/schedule">Schedule</Link>
              )}
            </>
          )}

          {token ? (
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <span className="text-yellow-200">Logged in as:</span>
                <span className="font-semibold ml-1">{userName || userEmail || 'User'}</span>
                {role && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 rounded text-xs">
                    {role}
                  </span>
                )}
              </div>
              <button 
                onClick={logout} 
                className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="ml-3 bg-green-500 px-4 py-1 rounded-lg hover:bg-green-600 transition"
              >
                Login
              </Link>
              <Link 
                to="/admin/login" 
                className="ml-2 bg-purple-500 px-4 py-1 rounded-lg hover:bg-purple-600 transition"
              >
                Admin Login
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  )
}
