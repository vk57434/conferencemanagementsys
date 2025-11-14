import React, { useState } from 'react'
import APIAuth from '../utils/apiAuth'

export default function ScheduleAdmin(){
  const [title,setTitle]=useState('')
  const [room,setRoom]=useState('')
  const [start,setStart]=useState('')
  const [end,setEnd]=useState('')
  const [papers,setPapers]=useState('')

  const create = async ()=>{
    try{
      await APIAuth.post('/schedules', { title, room, startTime: start, endTime: end, papers: papers.split(',') })
      alert('Session created')
    }catch(err){ alert(err.response?.data?.message || err.message) }
  }

  return (
    <div className="max-w-xl bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Create Session</h2>
      <input className="w-full p-2 border rounded mb-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input className="w-full p-2 border rounded mb-2" placeholder="Room" value={room} onChange={e=>setRoom(e.target.value)} />
      <label className="block text-sm mb-1">Start</label>
      <input type="datetime-local" className="w-full p-2 border rounded mb-2" value={start} onChange={e=>setStart(e.target.value)} />
      <label className="block text-sm mb-1">End</label>
      <input type="datetime-local" className="w-full p-2 border rounded mb-2" value={end} onChange={e=>setEnd(e.target.value)} />
      <input className="w-full p-2 border rounded mb-2" placeholder="paperIds comma separated" value={papers} onChange={e=>setPapers(e.target.value)} />
      <button onClick={create} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
    </div>
  )
}