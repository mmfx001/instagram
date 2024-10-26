import React, { useState, useEffect } from 'react'

const Actions = () => {
  const [posts, setPosts] = useState([]) // Initialize state to hold fetched data
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state
  const [filteredPosts, setFilteredPosts] = useState([]) // State for filtered posts

  useEffect(() => {
    // Fetch data from API when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setPosts(data) // Save data to state
        setFilteredPosts(data) // Initially set filteredPosts to all posts
      } catch (err) {
        setError(err.message) // Save error message to state
      } finally {
        setLoading(false) // Stop loading once data is fetched or an error occurs
      }
    }

    fetchData()
  }, []) // Empty dependency array means this runs once on mount

  // Function to filter posts by description
  const filterPosts = (description) => {
    if (description) {
      const filtered = posts.filter(post => post.description === description)
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(posts) // Reset to all posts if no description is provided
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-[25%] ml-60 bg-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-6">Ваши действия</h2>
        <ul className="space-y-4">
          <button onClick={() => filterPosts('Взаимодействия')} className="flex items-center space-x-2">
            <span className="text-gray-700">🔄</span>
            <p className="text-gray-700">Взаимодействия</p>
          </button>
          <button onClick={() => filterPosts('Фото и видео')} className="flex items-center space-x-2">
            <span className="text-gray-700">📷</span>
            <p className="text-gray-700">Фото и видео</p>
          </button>
          <button onClick={() => filterPosts('История аккаунта')} className="flex items-center space-x-2">
            <span className="text-gray-700">📅</span>
            <p className="text-gray-700">История аккаунта</p>
          </button>
          <button onClick={() => filterPosts('Действия с рекламой')} className="flex items-center space-x-2">
            <span className="text-gray-700">📢</span>
            <p className="text-gray-700">Действия с рекламой</p>
          </button>
          <button onClick={() => filterPosts('Скачать информацию')} className="flex items-center space-x-2">
            <span className="text-gray-700">⬇️</span>
            <p className="text-gray-700">Скачать информацию</p>
          </button>
          <button onClick={() => filterPosts(null)} className="flex items-center space-x-2">
            <span className="text-gray-700">🔄</span>
            <p className="text-gray-700">Показать все</p>
          </button>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-white overflow-y-scroll">
        {loading && <p>Загрузка данных...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && filteredPosts.length === 0 && (
          <p>Нет данных для отображения.</p>
        )}
        {!loading && !error && filteredPosts.length > 0 && (
          <div className="flex flex-wrap">
            {filteredPosts.map((post, index) => (
              <img key={index} src={post.post} alt="Post" className="object-cover w-[180px]" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Actions
