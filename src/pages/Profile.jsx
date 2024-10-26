import React, { useState, useEffect } from "react"
import { ChevronLeft, Heart, MessageCircle, Bookmark, Send, MoreHorizontal, X } from "lucide-react"

const Button = ({ children, onClick, variant = "default", size = "medium", className = "", disabled = false }) => {
  const baseStyle = "rounded-md font-semibold"
  const variantStyles = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-gray-600 hover:bg-gray-700",
    ghost: "hover:bg-gray-700",
    link: "underline-offset-4 hover:underline text-primary",
  }
  const sizeStyles = {
    medium: "px-4 py-2",
    icon: "p-2",
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const Avatar = ({ src, alt, fallback, size = "big" }) => {
  const sizeClass = size === "small" ? "w-8 h-8" : "w-[100px] h-[100px]"
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden bg-gray-300 flex items-center justify-center`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-600 font-bold">{fallback}</span>
      )}
    </div>
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

export default function EnhancedProfile() {
  const [userData, setUserData] = useState(null)
  const [publications, setPublications] = useState([])
  const [currents, setCurrents] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [followModalType, setFollowModalType] = useState(null)
  const [selectedPublication, setSelectedPublication] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    setIsLoading(true); // Set loading to true at the start
    try {
      const response = await fetch(`http://localhost:5001/users/1`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const user = await response.json();
      setCurrentUser(user);
      console.log('Current user ID:', user.id);
      await fetchUserData(user.id);
    } catch (error) {
      console.error("Error fetching current user data:", error);
    } finally {
      setIsLoading(false); // Ensure loading is set to false in any outcome
    }
  };


  const fetchUserData = async (userId) => {
    if (!userId) {
      console.error("Invalid user ID")
      return
    }
    try {
      const response = await fetch(`http://localhost:5001/users/${userId}`)
      const user = await response.json()
      setUserData(user)
      setIsCurrentUserProfile(userId === currentUser?.id)
      console.log('Is current user profile:', userId === currentUser?.id, 'userId:', userId, 'currentUser.id:', currentUser?.id)
      await fetchPublications(user.email)
      await fetchCurrents(user.email)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const fetchPublications = async (userEmail) => {
    try {
      const response = await fetch("http://localhost:5001/Publications")
      const publicationsData = await response.json()
      const userPublications = publicationsData.filter(
        (publication) => publication.author === userEmail
      ).map(pub => ({
        ...pub,
        comments: pub.comments || [],
        likedUsers: pub.likedUsers || [],
      }))
      setPublications(userPublications)
    } catch (error) {
      console.error("Error fetching publications:", error)
    }
  }

  const fetchCurrents = async (userEmail) => {
    try {
      const response = await fetch("http://localhost:5001/Currents")
      const currentsData = await response.json()
      const userCurrents = currentsData.filter(
        (current) => current.author === userEmail
      )
      setCurrents(userCurrents)
    } catch (error) {
      console.error("Error fetching stories:", error)
    }
  }

  const handleFollowClick = (type) => {
    setFollowModalType(type)
    setShowFollowModal(true)
  }

  const handleUserClick = (userId) => {
    setSelectedUser(null)
    fetchUserData(userId)
    setShowFollowModal(false)
  }

  const handlePublicationClick = (publication) => {
    setSelectedPublication(publication)
  }

  const handleClosePublication = () => {
    setSelectedPublication(null)
  }

  const handleLikePublication = async (publicationId) => {
    if (!currentUser) return

    try {
      const publication = publications.find(pub => pub.id === publicationId)
      const isLiked = publication.likedUsers.includes(currentUser.email)
      const updatedLikedUsers = isLiked
        ? publication.likedUsers.filter(email => email !== currentUser.email)
        : [...publication.likedUsers, currentUser.email]

      const response = await fetch(`http://localhost:5001/Publications/${publicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likedUsers: updatedLikedUsers,
        }),
      })

      if (response.ok) {
        setPublications(prevPublications =>
          prevPublications.map(pub =>
            pub.id === publicationId
              ? { ...pub, likedUsers: updatedLikedUsers }
              : pub
          )
        )
        if (selectedPublication && selectedPublication.id === publicationId) {
          setSelectedPublication(prevPub => ({
            ...prevPub,
            likedUsers: updatedLikedUsers
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
    if (newComment.trim() === "" || !currentUser) return


    const comment = {
      id: Date.now(),
      author: currentUser.nickName,
      authorId: currentUser.id,
      text: newComment,
      likedUsers: [],
    }

    try {
      const response = await fetch(`http://localhost:5001/Publications/${publicationId}`, {
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
    if (!currentUser) return

    try {
      const publication = publications.find(pub => pub.id === publicationId)
      const comment = publication.comments.find(com => com.id === commentId)
      const isLiked = comment.likedUsers.includes(currentUser.email)
      const updatedLikedUsers = isLiked
        ? comment.likedUsers.filter(email => email !== currentUser.email)
        : [...comment.likedUsers, currentUser.email]

      const updatedComments = publication.comments.map(com =>
        com.id === commentId ? { ...com, likedUsers: updatedLikedUsers } : com
      )

      const response = await fetch(`http://localhost:5001/Publications/${publicationId}`, {
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

  const handleFollowUser = async () => {
    if (!userData || !currentUser || isCurrentUserProfile) return

    const isFollowing = userData.followers.some(follower => follower.id === currentUser.id)


    try {
      const response = await fetch(`http://localhost:5001/users/${userData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followers: isFollowing
            ? userData.followers.filter(follower => follower.id !== currentUser.id)
            : [...userData.followers, { id: currentUser.id, email: currentUser.email }],
        }),
      })

      if (response.ok) {
        setUserData(prevUserData => ({
          ...prevUserData,
          followers: isFollowing
            ? prevUserData.followers.filter(follower => follower.id !== currentUser.id)
            : [...prevUserData.followers, { id: currentUser.id, email: currentUser.email }],
        }))

        // Update current user's following list
        const updatedCurrentUser = {
          ...currentUser,
          follows: isFollowing
            ? currentUser.follows.filter(follow => follow.id !== userData.id)
            : [...currentUser.follows, { id: userData.id, email: userData.email }]
        }
        setCurrentUser(updatedCurrentUser)

        // Update the server with the new following list for the current user
        await fetch(`http://localhost:5001/users/${currentUser.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            follows: updatedCurrentUser.follows,
          }),
        })
      } else {
        console.error('Failed to update follow status on the server')
      }
    } catch (error) {
      console.error('Error updating follow status:', error)
    }
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  if (!userData || !currentUser) {
    return <div className="text-white">Error loading profile data</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
            <div className="text-sm text-gray-400">publications</div>
          </div>
          <div className="text-center cursor-pointer" onClick={() => handleFollowClick("followers")}>
            <div className="font-bold">{userData.followers.length}</div>
            <div className="text-sm text-gray-400">followers</div>
          </div>
          <div className="text-center cursor-pointer" onClick={() => handleFollowClick("following")}>
            <div className="font-bold">{userData.follows.length}</div>
            <div className="text-sm text-gray-400">following</div>
          </div>
        </div>


        {/* Bio and Follow Button */}
        <div className="mb-4">
          <p className="font-semibold">{userData.nickName}</p>
          <p>{userData.description}</p>
          {!isCurrentUserProfile && (
            <Button
              onClick={handleFollowUser}
              className="mt-2 w-full"
              variant={userData.followers.some(follower => follower.id === currentUser.id) ? "outline" : "default"}
            >
              {userData.followers.some(follower => follower.id === currentUser.id) ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="reels">Reels</TabsTrigger>
            <TabsTrigger value="tagged">Tagged</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="grid grid-cols-3 gap-1">
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
                        {publication.likedUsers.length}
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


      {/* Followers/Following Modal */}
      {showFollowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 w-full max-w-md rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold">
                {followModalType === "followers" ? "Followers" : "Following"}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFollowModal(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {(followModalType === "followers" ? userData.followers : userData.follows).map((user) => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className="w-full flex items-center p-4 hover:bg-gray-700"
                  onClick={() => handleUserClick(user.id)}
                >
                  <Avatar src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.email}`} alt={user.email} fallback={user.email.charAt(0)} />
                  <span className="ml-4">{user.email}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Publication Modal */}
      {selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && handleClosePublication()}>
          <div className="bg-gray-800 w-full max-w-3xl flex relative">
            <Button
              onClick={handleClosePublication}
              className="absolute top-4 right-4 text-white z-10"
              variant="ghost"
              size="icon"
            >
              <X className="w-6 h-6" />
              <span className="sr-only">Close</span>
            </Button>
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
                <Button variant="ghost" size="icon" className="ml-auto">
                  <MoreHorizontal className="w-5 h-5" />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {selectedPublication.comments.map((comment) => (
                  <div key={comment.id} className="mb-4">
                    <div className="flex items-start">
                      <div className="ml-2">
                        <Button

                          variant="link"
                          className="font-semibold p-0 h-auto"
                          onClick={() => handleUserClick(comment.authorId)}
                        >
                          {comment.author}
                        </Button>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                    <div className="mt-2 ml-10 text-sm text-gray-400 flex items-center">
                      <Button variant="ghost" onClick={() => handleLikeComment(selectedPublication.id, comment.id)} className="h-auto p-0 mr-4">
                        {comment.likedUsers.includes(currentUser.email) ? 'Unlike' : 'Like'}
                      </Button>
                      <Button variant="ghost" className="h-auto p-0">Reply</Button>
                      <span className="ml-auto">{comment.likedUsers.length} likes</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-700">
                <div className="flex justify-between mb-4">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => handleLikePublication(selectedPublication.id)}>
                      <Heart className={`w-6 h-6 ${selectedPublication.likedUsers.includes(currentUser.email) ? 'text-red-500 fill-current' : ''}`} />
                      <span className="sr-only">Like</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="w-6 h-6" />
                      <span className="sr-only">Comment</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Send className="w-6 h-6" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="w-6 h-6" />
                    <span className="sr-only">Save</span>
                  </Button>
                </div>
                <div className="font-semibold mb-2">{selectedPublication.likedUsers.length} likes</div>
                <div className="text-sm text-gray-400 mb-4">1 DAY AGO</div>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent border-none focus:outline-none"
                  />
                  <Button
                    onClick={() => handleAddComment(selectedPublication.id)}
                    className="ml-2 text-blue-500 font-semibold"
                    disabled={!newComment.trim()}
                  >

                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
