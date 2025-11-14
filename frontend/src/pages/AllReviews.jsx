import React, { useEffect, useState } from 'react'
import APIAuth from '../utils/apiAuth'

export default function AllReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data } = await APIAuth.get('/reviews/all')
      setReviews(data)
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
      alert(err.response?.data?.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'Accept':
        return 'bg-green-100 text-green-800'
      case 'Reject':
        return 'bg-red-100 text-red-800'
      case 'Minor Revision':
        return 'bg-yellow-100 text-yellow-800'
      case 'Major Revision':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading reviews...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">All Reviews</h2>
        <button
          onClick={fetchReviews}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No reviews submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              {/* Paper Information */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {review.paper?.title || 'Unknown Paper'}
                </h3>
                {review.paper?.abstract && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {review.paper.abstract}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>Paper ID: {review.paper?._id || 'N/A'}</span>
                  {review.paper?.status && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      Status: {review.paper.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Review Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Reviewer</p>
                  <p className="text-gray-900">
                    {review.reviewer?.name || 'Unknown'} 
                    {review.reviewer?.email && (
                      <span className="text-gray-500 text-sm ml-2">
                        ({review.reviewer.email})
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Rating</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">{review.rating}</span>
                    <span className="text-gray-500">/ 10</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Recommendation</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRecommendationColor(review.recommendation)}`}>
                    {review.recommendation}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Submitted On</p>
                  <p className="text-gray-900">{formatDate(review.createdAt)}</p>
                </div>
              </div>

              {/* Comments */}
              {review.comments && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Comments</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {review.comments}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

