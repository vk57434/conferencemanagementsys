import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import APIAuth from '../utils/apiAuth'

export default function SubmitPaper(){
  const [title,setTitle]=useState('')
  const [abstract,setAbstract]=useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e?.preventDefault() // Prevent form submission if called from form
    if (!title.trim() || !abstract.trim()) {
      alert('Please fill in both title and abstract')
      return
    }
    
    // Prevent double submission
    if (loading) {
      return
    }
    
    setLoading(true)
    try{
      await APIAuth.post('/papers/submit', { title: title.trim(), abstract: abstract.trim() })
      alert('Paper submitted successfully!')
      // Clear form
      setTitle('')
      setAbstract('')
      // Navigate to home to see the updated dashboard
      navigate('/')
    }catch(err){ 
      const errorMessage = err.response?.data?.message || err.message
      alert(errorMessage)
      // Don't clear form if there's an error (user might want to fix and resubmit)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Submit Paper</h2>
      <form onSubmit={submit}>
        <input 
          className="w-full p-2 border rounded mb-2" 
          placeholder="Title" 
          value={title} 
          onChange={e=>setTitle(e.target.value)}
          disabled={loading}
          required
        />
        <textarea 
          className="w-full p-2 border rounded mb-2" 
          placeholder="Abstract" 
          rows={6} 
          value={abstract} 
          onChange={e=>setAbstract(e.target.value)}
          disabled={loading}
          required
        />
        <button 
          type="submit"
          disabled={loading || !title.trim() || !abstract.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Paper'}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        Note: You cannot submit the same paper title twice. Please use a unique title for each submission.
      </p>
    </div>
  )
}
