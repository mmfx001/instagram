import React, { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Bookmark, Send, MoreHorizontal, X } from "lucide-react"

const Avatar = ({ src, alt, fallback, size = "medium" }) => {
  const sizeClass = size === "small" ? "w-8 h-8" : "w-20 h-20"
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden bg-gray-300 flex items-center justify-center`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-bold">{fallback}</span>
      )}
    </div>
  )
}

const Button = ({ children, onClick, variant = "default", size = "medium", className = "" }) => {
  const baseStyle = "rounded-md font-semibold"
  const variantStyle = variant === "outline" ? "border border-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
  const sizeStyle = size === "icon" ? "p-2" : "px-4 py-2"

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
    >
      {children}
    </button>
  )
}

const Tabs = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  )
}

const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="flex justify-around border-b border-gray-800 mb-4">
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
)

const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`p-2 ${activeTab === value ? 'border-b-2 border-white' : ''}`}
  >
    {children}
  </button>
)

const TabsContent = ({ value, children, activeTab }) => (
  activeTab === value ? <div>{children}</div> : null
)

export default function Component() {
  const [userData, setUserData] = useState(null)
  const [publications, setPublications] = useState([])
  const [currents, setCurrents] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [nickName, setNickName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedStory, setSelectedStory] = useState(null)
  const [selectedPublication, setSelectedPublication] = useState(null)
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://192.168.81.151:5000/users/1")
        const user = await response.json()
        setUserData(user)
        setNickName(user.nickName)
        setDescription(user.description)
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch("http://192.168.81.151:5000/Publications")
        const publicationsData = await response.json()
        const userPublications = publicationsData.filter(
          (publication) => publication.author === userData?.email
        ).map(pub => ({
          ...pub,
          comments: pub.comments || [],
          isLiked: false,
        }))
        setPublications(userPublications)
      } catch (error) {
        console.error("Ошибка при получении публикаций:", error)
      }
    }

    const fetchCurrents = async () => {
      try {
        const response = await fetch("http://192.168.81.151:5000/Currents")
        const currentsData = await response.json()
        const userCurrents = currentsData.filter(
          (current) => current.author === userData?.email
        )
        setCurrents(userCurrents)
      } catch (error) {
        console.error("Ошибка при получении историй:", error)
      }
    }

    if (userData) {
      fetchPublications()
      fetchCurrents()
    }
  }, [userData])

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev)
  }

  const handleSave = () => {
    console.log("Изменения сохранены:", { nickName, description })
    setIsEditing(false)
  }

  const handleStoryClick = (story) => {
    setSelectedStory(story)
  }

  const handleCloseStory = () => {
    setSelectedStory(null)
  }

  const handlePublicationClick = (publication) => {
    setSelectedPublication(publication)
  }

  const handleClosePublication = () => {
    setSelectedPublication(null)
  }

  const handleLikePublication = async (publicationId) => {
    try {
      const response = await fetch(`http://localhost:5000/Publications/${publicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likes: selectedPublication.isLiked ? selectedPublication.likes - 1 : selectedPublication.likes + 1,
          isLiked: !selectedPublication.isLiked,
        }),
      })

      if (response.ok) {
        setPublications(prevPublications =>
          prevPublications.map(pub =>
            pub.id === publicationId
              ? { ...pub, likes: pub.isLiked ? pub.likes - 1 : pub.likes + 1, isLiked: !pub.isLiked }
              : pub
          )
        )
        if (selectedPublication && selectedPublication.id === publicationId) {
          setSelectedPublication(prevPub => ({
            ...prevPub,
            likes: prevPub.isLiked ? prevPub.likes - 1 : prevPub.likes + 1,
            isLiked: !prevPub.isLiked
          }))
        }
      } else {
        console.error('Failed to update like status on the server')
      }
    } catch (error) {
      console.error('Error updating like status:', error)
    }
  }

  const handleAddComment = async (publicationId) => {
    if (newComment.trim() === "") return

    const comment = {
      id: Date.now(),
      author: userData.nickName,
      text: newComment,
      likes: 0,
      isLiked: false,
    }

    try {
      const response = await fetch(`http://localhost:5000/Publications/${publicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments: [...selectedPublication.comments, comment],
        }),
      })

      if (response.ok) {
        setPublications(prevPublications =>
          prevPublications.map(pub =>
            pub.id === publicationId
              ? { ...pub, comments: [...pub.comments, comment] }
              : pub
          )
        )

        if (selectedPublication && selectedPublication.id === publicationId) {
          setSelectedPublication(prevPub => ({
            ...prevPub,
            comments: [...prevPub.comments, comment]
          }))
        }

        setNewComment("")
      } else {
        console.error('Failed to add comment on the server')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleLikeComment = async (publicationId, commentId) => {
    try {
      const updatedComments = selectedPublication.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
          : comment
      )

      const response = await fetch(`http://localhost:5000/Publications/${publicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comments: updatedComments,
        }),
      })

      if (response.ok) {
        setPublications(prevPublications =>
          prevPublications.map(pub =>
            pub.id === publicationId
              ? { ...pub, comments: updatedComments }
              : pub
          )
        )

        if (selectedPublication && selectedPublication.id === publicationId) {
          setSelectedPublication(prevPub => ({
            ...prevPub,
            comments: updatedComments
          }))
        }
      } else {
        console.error('Failed to update comment like status on the server')
      }
    } catch (error) {
      console.error('Error updating comment like status:', error)
    }
  }

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClosePublication()
    }
  }

  if (!userData) {
    return <div className="text-white">Загрузка...</div>
  }

  return (
    <div className=" min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Header */}
        <div className="flex items-center mb-4">
          <Avatar src={userData.avatar} alt={userData.nickName} fallback={userData.nickName.charAt(0)} />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{userData.nickName}</h2>
            <p className="text-sm text-gray-400">{userData.note}</p>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="flex justify-around mb-4">
          <div className="text-center">
            <div className="font-bold">{publications.length}</div>
            <div className="text-sm text-gray-400">публикаций</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{userData.followers.length}</div>
            <div className="text-sm text-gray-400">подписчиков</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{userData.follows.length}</div>
            <div className="text-sm text-gray-400">подписок</div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="font-semibold">{userData.nickName}</p>
          <p>{userData.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-4">
          <Button variant="outline" className="flex-1" onClick={handleEditToggle}>
            {isEditing ? "Отменить" : "Редактировать профиль"}
          </Button>
          <Button variant="outline" className="flex-1">
            Просмотреть архив
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Stories */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex space-x-4">
            {currents.map((current) => (
              <button
                key={current.id}
                onClick={() => handleStoryClick(current)}
                className="flex flex-col items-center focus:outline-none"
              >
                <Avatar src={current.thumbnail} alt="Story thumbnail" fallback="ST" size="big" />
                <span className="text-xs mt-1 w-16 truncate">Story {current.id}</span>
              </button>
            ))}
          </div>
        </div>
        {selectedStory && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 ">
            <div className="flex   max-w-lg">

              <video src={selectedStory.url} className="w-full h-auto" controls autoPlay />
              <Button

                variant="ghost"
                size="icon"
                className=" top-4 right-4 text-white w-[40px] h-[40px]"
                onClick={handleCloseStory}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </TabsTrigger>
            <TabsTrigger value="reels">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </TabsTrigger>
            <TabsTrigger value="tagged">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="grid grid-cols-3 gap-1 text-white">
              {publications.map((publication) => (
                <div
                  key={publication.id}
                  className="aspect-square relative cursor-pointer"
                  onClick={() => handlePublicationClick(publication)}
                >
                  <video
                    src={publication.url}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Heart className="w-6 h-6 mr-2" />
                        {publication.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-6 h-6 mr-2" />
                        {publication.comments.length}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Publication Modal */}
      {
        selectedPublication && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleOutsideClick}>
            <div className="bg-[white] w-full max-w-3xl flex relative">
              <button
                onClick={handleClosePublication}
                className="absolute top-4 right-4 text-white z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="w-3/5 relative">
                <video
                  src={selectedPublication.url}
                  className="w-full h-full object-cover"
                  controls
                />

              </div>
              <div className="w-3/5 flex flex-col">
                <div className="p-4 border-b border-gray-700 flex items-center">
                  <Avatar src={userData.avatar} alt={userData.nickName} fallback={userData.nickName.charAt(0)} size="small" />
                  <span className="ml-2 font-semibold">{userData.nickName}</span>
                  <button className="ml-auto">
                    <MoreHorizontal className="w-5 h-5 " />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {selectedPublication.comments.map((comment) => (
                    <div key={comment.id} className="mb-4">
                      <div className="flex items-start">

                        <div className="ml-2">
                          <span className="font-semibold">{comment.username}</span>
                          <p>{comment.text}</p>
                        </div>
                      </div>
                      <div className="mt-2 ml-10 text-sm text-gray-400 flex items-center">
                        <button onClick={() => handleLikeComment(selectedPublication.id, comment.id)} className="mr-4">
                          {comment.isLiked ? 'Не нравится' : 'Нравится'}
                        </button>
                        <span>Ответить</span>
                        <span className="ml-auto">{comment.likes} likes</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-700">
                  <div className="flex justify-between mb-4">
                    <div className="flex space-x-4">
                      <button onClick={() => handleLikePublication(selectedPublication.id)}>
                        <Heart className={`w-6 h-6 ${selectedPublication.isLiked ? 'text-red-500 fill-current' : ''}`} />
                      </button>
                      <button>
                        <MessageCircle className="w-6 h-6" />
                      </button>
                      <button>
                        <Send className="w-6 h-6" />
                      </button>
                    </div>
                    <button>
                      <Bookmark className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="font-semibold mb-2">{selectedPublication.likes} likes</div>
                  <div className="text-sm text-gray-400 mb-4">1 DAY AGO</div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-transparent border-none focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(selectedPublication.id)}
                      className="ml-2 text-blue-500 font-semibold"
                      disabled={!newComment.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}