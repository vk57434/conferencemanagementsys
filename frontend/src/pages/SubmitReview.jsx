import React, { useState, useEffect } from 'react'
import APIAuth from '../utils/apiAuth'

export default function SubmitReview(){
  const [paperId, setPaperId] = useState('')
  const [assignedPapers, setAssignedPapers] = useState([])
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [rating, setRating] = useState(7)
  const [recommendation, setRecommendation] = useState('Accept')
  const [comments, setComments] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAssignedPapers()
  }, [])

  const fetchAssignedPapers = async () => {
    try {
      const { data } = await APIAuth.get('/papers/my-assigned')
      setAssignedPapers(data)
    } catch (err) {
      console.error('Failed to fetch assigned papers:', err)
      alert(err.response?.data?.message || 'Failed to load assigned papers')
    }
  }

  const handlePaperSelect = (e) => {
    const selectedId = e.target.value
    setPaperId(selectedId)
    const paper = assignedPapers.find(p => p._id === selectedId)
    setSelectedPaper(paper)
  }

  const submit = async (e) => {
    e.preventDefault()
    
    // Prevent double submission
    if (loading) {
      return
    }
    
    if (!paperId) {
      alert('Please select a paper to review')
      return
    }
    if (!comments.trim()) {
      alert('Please provide comments for your review')
      return
    }
    
    setLoading(true)
    try{
      await APIAuth.post('/reviews/submit', { paperId, rating, recommendation, comments })
      alert('Review submitted successfully!')
      // Reset form
      setPaperId('')
      setSelectedPaper(null)
      setRating(7)
      setRecommendation('Accept')
      setComments('')
      // Refresh assigned papers
      fetchAssignedPapers()
    }catch(err){ 
      alert(err.response?.data?.message || err.message) 
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Review</h2>
      
      <form onSubmit={submit} className="space-y-4">
        {/* Paper Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Paper to Review *
          </label>
          <select 
            value={paperId} 
            onChange={handlePaperSelect}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Choose a paper...</option>
            {assignedPapers.map(paper => (
              <option key={paper._id} value={paper._id}>
                {paper.title} - {paper.status}
              </option>
            ))}
          </select>
          {assignedPapers.length === 0 && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                ✓ All assigned papers have been reviewed
              </p>
              <p className="text-xs text-blue-600 mt-1">
                You have completed reviews for all papers assigned to you. No further action needed.
              </p>
            </div>
          )}
        </div>

        {/* Paper Details (shown when paper is selected) */}
        {selectedPaper && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">{selectedPaper.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{selectedPaper.abstract}</p>
            <p className="text-xs text-gray-500">Status: <span className="font-medium">{selectedPaper.status}</span></p>
            {selectedPaper.author && (
              <p className="text-xs text-gray-500 mt-1">Author: {selectedPaper.author.name || selectedPaper.author.email}</p>
            )}
          </div>
        )}

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating (1-10) *
          </label>
          <input 
            type="number" 
            min="1" 
            max="10" 
            value={rating} 
            onChange={e=>setRating(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Current rating: {rating}/10</p>
        </div>

        {/* Recommendation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recommendation *
          </label>
          <select 
            value={recommendation} 
            onChange={e=>setRecommendation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="Accept">Accept</option>
            <option value="Minor Revision">Minor Revision</option>
            <option value="Major Revision">Major Revision</option>
            <option value="Reject">Reject</option>
          </select>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comments *
          </label>
          <textarea 
            rows={6} 
            placeholder="Provide detailed feedback and comments about the paper..."
            value={comments} 
            onChange={e=>setComments(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={loading || !paperId || assignedPapers.length === 0}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}