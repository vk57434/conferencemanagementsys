import React, { useState, useEffect } from 'react'
import APIAuth from '../utils/apiAuth'

export default function ScheduleView(){
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const { data } = await APIAuth.get('/schedules')
      setSessions(data)
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
      alert(err.response?.data?.message || 'Failed to load schedule')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto mt-10">
        <p className="text-center text-gray-500">Loading schedule...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Conference Schedule</h2>
      <div className="bg-white p-4 rounded shadow space-y-4">
        {sessions.length > 0 ? (
          sessions.map(session => (
            <div key={session._id} className="p-4 border rounded hover:bg-gray-50">
              <h3 className="font-bold text-lg mb-2">{session.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {session.room && (
                  <p><span className="font-medium">Room:</span> {session.room}</p>
                )}
                {session.startTime && (
                  <p><span className="font-medium">Start:</span> {new Date(session.startTime).toLocaleString()}</p>
                )}
                {session.endTime && (
                  <p><span className="font-medium">End:</span> {new Date(session.endTime).toLocaleString()}</p>
                )}
                {session.chairs && session.chairs.length > 0 && (
                  <p>
                    <span className="font-medium">Chairs:</span> {
                      session.chairs.map((chair, idx) => 
                        typeof chair === 'object' ? chair.name : chair
                      ).join(', ')
                    }
                  </p>
                )}
              </div>
              {session.papers && session.papers.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium text-sm mb-1">Papers:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {session.papers.map((paper, idx) => (
                      <li key={idx}>
                        {typeof paper === 'object' ? paper.title : paper}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No sessions scheduled yet</p>
        )}
      </div>
    </div>
  )
}

