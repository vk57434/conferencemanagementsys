import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import APIAuth from '../utils/apiAuth'

export default function Decision(){
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paperId,setPaperId]=useState('')
  const [decision,setDecision]=useState('Accepted')
  const [comments,setComments]=useState('')
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchPapers = async () => {
    try {
      const { data } = await APIAuth.get('/papers')
      setPapers(data)
    } catch (err) {
      console.error('Failed to fetch papers:', err)
    }
  }

  useEffect(() => {
    // Get paperId from URL if provided
    const urlPaperId = searchParams.get('paperId')
    if (urlPaperId) {
      setPaperId(urlPaperId)
    }
    
    // Fetch papers for dropdown
    fetchPapers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const submit = async ()=>{
    if (!paperId) {
      alert('Please select or enter a Paper ID')
      return
    }
    setLoading(true)
    try{
      await APIAuth.post('/papers/decision', { paperId, decision, comments })
      alert('Decision submitted successfully!')
      // Clear form
      setPaperId('')
      setComments('')
      setDecision('Accepted')
      // Refresh papers list
      fetchPapers()
      // Navigate back to papers page
      navigate('/papers')
    }catch(err){ 
      alert(err.response?.data?.message || err.message) 
    } finally {
      setLoading(false)
    }
  }

  // Get selected paper details for display
  const selectedPaper = papers.find(p => p._id === paperId)

  return (
    <div className="max-w-lg bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-4 text-xl">Make Decision</h2>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Paper
        </label>
        <select 
          className="w-full p-2 border rounded mb-2" 
          value={paperId} 
          onChange={e=>setPaperId(e.target.value)}
        >
          <option value="">-- Select a paper --</option>
          {papers.map(paper => (
            <option key={paper._id} value={paper._id}>
              {paper.title} ({paper.status})
            </option>
          ))}
        </select>
        {selectedPaper && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
            <p><strong>Title:</strong> {selectedPaper.title}</p>
            <p><strong>Status:</strong> {selectedPaper.status}</p>
            <p className="text-xs text-gray-400 font-mono mt-1">ID: {selectedPaper._id}</p>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Decision
        </label>
        <select 
          className="w-full p-2 border rounded" 
          value={decision} 
          onChange={e=>setDecision(e.target.value)}
        >
          <option>Accepted</option>
          <option>Rejected</option>
          <option>Minor Revision</option>
          <option>Major Revision</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comments
        </label>
        <textarea 
          className="w-full p-2 border rounded" 
          rows={4} 
          placeholder="Enter comments (optional)" 
          value={comments} 
          onChange={e=>setComments(e.target.value)} 
        />
      </div>

      <button 
        onClick={submit} 
        disabled={loading || !paperId}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Decision'}
      </button>
    </div>
  )
}
