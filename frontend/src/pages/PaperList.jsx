import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import APIAuth from '../utils/apiAuth'

export default function PaperList(){
  const [papers, setPapers] = useState([])
  const [reviewers, setReviewers] = useState([])
  const [selectedReviewer, setSelectedReviewer] = useState({})
  const role = localStorage.getItem('role')
  const isAdmin = role === 'Admin'
  const navigate = useNavigate()

  useEffect(()=>{ 
    fetchPapers()
    // Only fetch reviewers if user is Admin
    if (isAdmin) {
      fetchReviewers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const fetchPapers = async ()=>{
    const { data } = await APIAuth.get('/papers')
    setPapers(data)
  }

  const fetchReviewers = async () => {
    try {
      const { data } = await APIAuth.get('/users/reviewers')
      setReviewers(data)
    } catch (err) {
      console.error('Failed to fetch reviewers:', err)
    }
  }

  const assign = async (paperId) => {
    const reviewerId = selectedReviewer[paperId]
    if (!reviewerId) {
      alert('Please select a reviewer for this paper')
      return
    }
    try{
      await APIAuth.post('/reviews/assign', { paperId, reviewerId })
      alert('Reviewer assigned successfully')
      fetchPapers()
      // Clear selection for this paper
      setSelectedReviewer(prev => {
        const newState = { ...prev }
        delete newState[paperId]
        return newState
      })
    }catch(err){ 
      alert(err.response?.data?.message || err.message) 
    }
  }

  // Check if paper needs a decision (admins can make decisions on any paper that doesn't have a final status)
  // This includes papers in "Submitted" status (before review) and "Under Review" status (after review)
  const needsDecision = (status) => {
    const finalStatuses = ['Accepted', 'Rejected', 'Minor Revision', 'Major Revision']
    return !finalStatuses.includes(status)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        {role === 'Reviewer' ? 'Papers Assigned to Me' : 'All Papers'}
      </h2>
      <div className="bg-white p-4 rounded shadow space-y-3">
        {papers.map(p=> (
          <div key={p._id} className="p-3 border rounded">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-bold">{p.title}</h3>
                {isAdmin && (
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    ID: {p._id}
                  </p>
                )}
              </div>
              {isAdmin && needsDecision(p.status) && (
                <button
                  onClick={() => navigate(`/decision?paperId=${p._id}`)}
                  className="ml-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                  title={!p.reviewer ? "Make decision (can decide before review)" : "Make decision"}
                >
                  Make Decision
                </button>
              )}
              {isAdmin && !needsDecision(p.status) && (
                <span className="ml-2 px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded">
                  Decision Made
                </span>
              )}
            </div>
            <p className="text-gray-600">{p.abstract}</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-gray-500">Status:</p>
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                p.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                p.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                p.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                p.status === 'Minor Revision' ? 'bg-blue-100 text-blue-700' :
                p.status === 'Major Revision' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {p.status}
              </span>
            </div>
            {p.reviewer && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  ✓ Assigned to reviewer
                </p>
                {p.reviewer && typeof p.reviewer === 'object' && (
                  <p className="text-xs text-green-600 mt-1">
                    Reviewer: {p.reviewer.name || p.reviewer.email || 'Unknown'}
                  </p>
                )}
              </div>
            )}
            {/* Only show reviewer assignment interface to Admin for papers without a reviewer */}
            {isAdmin && !p.reviewer && (
              <div className="mt-3 flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Reviewer
                  </label>
                  <select 
                    value={selectedReviewer[p._id] || ''} 
                    onChange={e => setSelectedReviewer(prev => ({ ...prev, [p._id]: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">Choose a reviewer...</option>
                    {reviewers.map(reviewer => (
                      <option key={reviewer._id} value={reviewer._id}>
                        {reviewer.name} ({reviewer.email})
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={()=>assign(p._id)} 
                  disabled={!selectedReviewer[p._id]}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign
                </button>
              </div>
            )}
          </div>
        ))}
        {papers.length === 0 && (
          <p className="text-gray-500 text-center py-4">No papers found</p>
        )}
      </div>
    </div>
  )
}