import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import APIAuth from '../utils/apiAuth'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const role = localStorage.getItem('role')
  const userName = localStorage.getItem('userName')
  const isAdmin = role === 'Admin'
  const isReviewer = role === 'Reviewer'
  const isAuthor = role === 'Author'
  const isParticipant = role === 'Participant'

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats()
    } else if (isReviewer) {
      fetchReviewerStats()
    } else if (isAuthor) {
      fetchAuthorStats()
    } else if (isParticipant) {
      fetchParticipantStats()
    } else {
      setLoading(false)
    }
  }, [isAdmin, isReviewer, isAuthor, isParticipant])

  const fetchAdminStats = async () => {
    try {
      const { data } = await APIAuth.get('/stats/dashboard')
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviewerStats = async () => {
    try {
      const { data } = await APIAuth.get('/stats/reviewer')
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch reviewer stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAuthorStats = async () => {
    try {
      const { data } = await APIAuth.get('/stats/author')
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch author stats:', err)
      console.error('Error details:', err.response?.data || err.message)
      // Set empty stats to prevent error display
      setStats({
        overview: {
          totalPapers: 0,
          submitted: 0,
          underReview: 0,
          accepted: 0,
          rejected: 0,
          minorRevision: 0,
          majorRevision: 0
        },
        recentPapers: [],
        recentReviews: []
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchParticipantStats = async () => {
    try {
      const { data } = await APIAuth.get('/stats/participant')
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch participant stats:', err)
      console.error('Error details:', err.response?.data || err.message)
      // Set empty stats to prevent error display
      setStats({
        overview: {
          totalSessions: 0,
          upcomingSessions: 0,
          acceptedPapers: 0
        },
        upcomingSessions: [],
        acceptedPapers: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin && !isReviewer && !isAuthor && !isParticipant) {
  return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
        Conference Management System
      </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Streamline your academic conference workflow with our comprehensive management platform
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
            Everything You Need
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            A complete solution for managing academic conferences
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Paper Submission</h3>
              <p className="text-gray-600">
                Submit your research papers with ease. Track submission status and receive real-time updates.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Peer Review</h3>
              <p className="text-gray-600">
                Comprehensive review system with detailed feedback, ratings, and recommendation tracking.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Schedule Management</h3>
              <p className="text-gray-600">
                Organize sessions, assign chairs, and manage conference schedules efficiently.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Secure Payments</h3>
              <p className="text-gray-600">
                Integrated payment processing for conference registration fees with secure transactions.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">User Management</h3>
              <p className="text-gray-600">
                Role-based access control for Authors, Reviewers, Participants, and Administrators.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Real-time statistics and insights for administrators to monitor conference progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto mt-10">
        <p className="text-center text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  // Safety check - if stats is null, show error
  if (!stats) {
    return (
      <div className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto mt-10">
        <p className="text-center text-red-500">Failed to load dashboard statistics. Please try refreshing the page.</p>
        <p className="text-center text-gray-500 text-sm mt-2">If the problem persists, please contact support.</p>
      </div>
    )
  }

  // Render Author Dashboard
  if (isAuthor) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-bold mb-2">Author Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userName || 'Author'}!</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Papers" value={stats.overview.totalPapers} color="blue" />
          <StatCard title="Submitted" value={stats.overview.submitted} color="gray" />
          <StatCard title="Under Review" value={stats.overview.underReview} color="yellow" />
          <StatCard title="Accepted" value={stats.overview.accepted} color="green" />
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <StatusCard title="Rejected" value={stats.overview.rejected} color="red" />
          <StatusCard title="Minor Revision" value={stats.overview.minorRevision} color="blue" />
          <StatusCard title="Major Revision" value={stats.overview.majorRevision} color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Papers */}
          <div className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Papers</h2>
              <Link to="/submit-paper" className="text-blue-600 hover:text-blue-800 text-sm">Submit New</Link>
            </div>
            <div className="space-y-3">
              {stats.recentPapers && stats.recentPapers.length > 0 ? (
                stats.recentPapers.map((paper) => (
                  <div key={paper._id} className="p-3 border rounded hover:bg-gray-50">
                    <p className="font-medium">{paper.title}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        paper.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                        paper.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        paper.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                        paper.status === 'Minor Revision' ? 'bg-blue-100 text-blue-700' :
                        paper.status === 'Major Revision' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {paper.status}
                      </span>
                      {paper.reviewer && (
                        <span className="text-xs text-gray-500">
                          Reviewer: {typeof paper.reviewer === 'object' ? paper.reviewer.name : 'Assigned'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No papers submitted yet</p>
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Reviews</h2>
            </div>
            <div className="space-y-3">
              {stats.recentReviews && stats.recentReviews.length > 0 ? (
                stats.recentReviews.map((review) => (
                  <div key={review._id} className="p-3 border rounded hover:bg-gray-50">
                    <p className="font-medium">
                      {review.paper && (typeof review.paper === 'object' ? review.paper.title : 'Paper')}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        review.recommendation === 'Accept' ? 'bg-green-100 text-green-700' :
                        review.recommendation === 'Reject' ? 'bg-red-100 text-red-700' :
                        review.recommendation === 'Minor Revision' ? 'bg-blue-100 text-blue-700' :
                        review.recommendation === 'Major Revision' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {review.recommendation || 'N/A'}
                      </span>
                      {review.reviewer && (
                        <span className="text-xs text-gray-500">
                          {typeof review.reviewer === 'object' ? review.reviewer.name : 'Reviewer'}
                        </span>
                      )}
                    </div>
                    {review.rating && (
                      <p className="text-xs text-gray-500 mt-1">Rating: {review.rating}/10</p>
                    )}
                    {review.comments && (
                      <p className="text-xs text-gray-600 mt-1 italic">"{review.comments.substring(0, 50)}..."</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No reviews received yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/submit-paper" 
              className="p-4 border rounded hover:bg-blue-50 hover:border-blue-300 transition text-center"
            >
              <p className="font-medium">Submit New Paper</p>
            </Link>
            <Link 
              to="/papers" 
              className="p-4 border rounded hover:bg-purple-50 hover:border-purple-300 transition text-center"
            >
              <p className="font-medium">View All Papers</p>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Render Reviewer Dashboard
  if (isReviewer) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-bold mb-2">Reviewer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userName || 'Reviewer'}!</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Assigned" value={stats.overview.totalAssigned} color="blue" />
          <StatCard title="Pending Reviews" value={stats.overview.pendingReviews} color="yellow" />
          <StatCard title="Completed Reviews" value={stats.overview.completedReviews} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Papers */}
          <div className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Papers Pending Review</h2>
              <Link to="/papers" className="text-blue-600 hover:text-blue-800 text-sm">View All</Link>
            </div>
            <div className="space-y-3">
              {stats.pendingPapers && stats.pendingPapers.length > 0 ? (
                stats.pendingPapers.map((paper) => (
                  <div key={paper._id} className="p-3 border rounded hover:bg-gray-50">
                    <p className="font-medium">{paper.title}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                        {paper.status}
                      </span>
                      {paper.author && (
                        <span className="text-xs text-gray-500">
                          {typeof paper.author === 'object' ? paper.author.name : 'Author'}
                        </span>
                      )}
                    </div>
                    <Link 
                      to="/submit-review"
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                    >
                      Submit Review →
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No pending papers to review</p>
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Reviews</h2>
              <Link to="/submit-review" className="text-blue-600 hover:text-blue-800 text-sm">Submit Review</Link>
            </div>
            <div className="space-y-3">
              {stats.recentReviews && stats.recentReviews.length > 0 ? (
                stats.recentReviews.map((review) => (
                  <div key={review._id} className="p-3 border rounded hover:bg-gray-50">
                    <p className="font-medium">
                      {review.paper && (typeof review.paper === 'object' ? review.paper.title : 'Paper')}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        review.recommendation === 'Accept' ? 'bg-green-100 text-green-700' :
                        review.recommendation === 'Reject' ? 'bg-red-100 text-red-700' :
                        review.recommendation === 'Minor Revision' ? 'bg-blue-100 text-blue-700' :
                        review.recommendation === 'Major Revision' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {review.recommendation || 'N/A'}
                      </span>
                      {review.rating && (
                        <span className="text-xs text-gray-500">
                          Rating: {review.rating}/10
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No reviews submitted yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/papers" 
              className="p-4 border rounded hover:bg-blue-50 hover:border-blue-300 transition text-center"
            >
              <p className="font-medium">View Assigned Papers</p>
            </Link>
            <Link 
              to="/submit-review" 
              className="p-4 border rounded hover:bg-purple-50 hover:border-purple-300 transition text-center"
            >
              <p className="font-medium">Submit Review</p>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Render Participant Dashboard
  if (isParticipant) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-3xl font-bold mb-2">Participant Dashboard</h1>
          <p className="text-gray-600">Welcome, {userName || 'Participant'}! Explore the conference.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Sessions" value={stats.overview.totalSessions} color="blue" />
          <StatCard title="Upcoming Sessions" value={stats.overview.upcomingSessions} color="green" />
          <StatCard title="Accepted Papers" value={stats.overview.acceptedPapers} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <div className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
              <Link to="/schedule" className="text-blue-600 hover:text-blue-800 text-sm">View All</Link>
            </div>
            <div className="space-y-3">
              {stats.upcomingSessions && stats.upcomingSessions.length > 0 ? (
                stats.upcomingSessions.map((session) => (
                  <div key={session._id} className="p-3 border rounded hover:bg-gray-50">
                    <p className="font-medium">{session.title}</p>
                    <div className="mt-2 space-y-1">
                      {session.room && (
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Room:</span> {session.room}
                        </p>
                      )}
                      {session.startTime && (
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Time:</span> {new Date(session.startTime).toLocaleString()}
                        </p>
                      )}
                      {session.chairs && session.chairs.length > 0 && (
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Chair:</span> {
                            typeof session.chairs[0] === 'object' 
                              ? session.chairs[0].name 
                              : 'TBA'
                          }
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming sessions scheduled</p>
              )}
            </div>
          </div>

          {/* Accepted Papers */}
          <div className="bg-white p-6 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Accepted Papers</h2>
            </div>
            <div className="space-y-3">
              {stats.acceptedPapers && stats.acceptedPapers.length > 0 ? (
                stats.acceptedPapers.map((paper) => (
                  <div key={paper._id} className="p-3 border rounded hover:bg-gray-50">
                    <p className="font-medium">{paper.title}</p>
                    <div className="mt-1">
                      {paper.author && (
                        <p className="text-xs text-gray-500">
                          By: {typeof paper.author === 'object' ? paper.author.name : 'Author'}
                        </p>
                      )}
                      {paper.abstract && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {paper.abstract.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                      Accepted
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No accepted papers yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/schedule" 
              className="p-4 border rounded hover:bg-blue-50 hover:border-blue-300 transition text-center"
            >
              <p className="font-medium">View Conference Schedule</p>
            </Link>
            <Link 
              to="/payment" 
              className="p-4 border rounded hover:bg-green-50 hover:border-green-300 transition text-center"
            >
              <p className="font-medium">Registration Info</p>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Render Admin Dashboard
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {userName || 'Admin'}!</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Papers" value={stats.overview.totalPapers} color="blue" />
        <StatCard title="Total Users" value={stats.overview.totalUsers} color="green" />
        <StatCard title="Total Reviews" value={stats.overview.totalReviews} color="purple" />
        <StatCard title="Sessions" value={stats.overview.totalSessions} color="orange" />
      </div>

      {/* Paper Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <StatusCard title="Submitted" value={stats.papers.submitted} color="gray" />
        <StatusCard title="Under Review" value={stats.papers.underReview} color="yellow" />
        <StatusCard title="Accepted" value={stats.papers.accepted} color="green" />
        <StatusCard title="Rejected" value={stats.papers.rejected} color="red" />
        <StatusCard title="Minor Revision" value={stats.papers.minorRevision} color="blue" />
        <StatusCard title="Major Revision" value={stats.papers.majorRevision} color="orange" />
        <StatusCard title="Unassigned" value={stats.papers.unassigned} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Papers */}
        <div className="bg-white p-6 rounded shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Papers</h2>
            <Link to="/papers" className="text-blue-600 hover:text-blue-800 text-sm">View All</Link>
          </div>
          <div className="space-y-3">
            {stats.recentPapers.length > 0 ? (
              stats.recentPapers.map((paper) => (
                <div key={paper._id} className="p-3 border rounded hover:bg-gray-50">
                  <p className="font-medium">{paper.title}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      paper.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                      paper.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      paper.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                      paper.status === 'Minor Revision' ? 'bg-blue-100 text-blue-700' :
                      paper.status === 'Major Revision' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {paper.status}
                    </span>
                    {paper.author && (
                      <span className="text-xs text-gray-500">
                        {typeof paper.author === 'object' ? paper.author.name : 'Author'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No papers yet</p>
            )}
          </div>
        </div>

        {/* Pending Decisions */}
        <div className="bg-white p-6 rounded shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pending Decisions</h2>
            <Link to="/decision" className="text-blue-600 hover:text-blue-800 text-sm">Make Decision</Link>
          </div>
          <div className="space-y-3">
            {stats.pendingDecisions.length > 0 ? (
              stats.pendingDecisions.map((paper) => (
                <div key={paper._id} className="p-3 border rounded hover:bg-gray-50">
                  <p className="font-medium">{paper.title}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                      {paper.status}
                    </span>
                    <Link 
                      to={`/decision?paperId=${paper._id}`}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Review →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pending decisions</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/papers" 
            className="p-4 border rounded hover:bg-blue-50 hover:border-blue-300 transition text-center"
          >
            <p className="font-medium">View Papers</p>
          </Link>
          <Link 
            to="/decision" 
            className="p-4 border rounded hover:bg-purple-50 hover:border-purple-300 transition text-center"
          >
            <p className="font-medium">Make Decision</p>
          </Link>
          <Link 
            to="/schedule-admin" 
            className="p-4 border rounded hover:bg-green-50 hover:border-green-300 transition text-center"
          >
            <p className="font-medium">Manage Schedule</p>
          </Link>
          <Link 
            to="/all-reviews" 
            className="p-4 border rounded hover:bg-orange-50 hover:border-orange-300 transition text-center"
          >
            <p className="font-medium">View Reviews</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300'
  }

  return (
    <div className={`bg-white p-6 rounded shadow-md border-l-4 ${colorClasses[color]}`}>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function StatusCard({ title, value, color }) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700'
  }

  return (
    <div className={`p-4 rounded shadow-md text-center ${colorClasses[color]}`}>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
