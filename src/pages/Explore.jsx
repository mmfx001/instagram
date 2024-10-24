import React, { useState, useEffect } from 'react';

const Explore = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch data from Posts endpoint
    fetch('http://localhost:5000/Posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 ml-[250px]">
        {posts.length >= 5 && (
          <div className="flex">
            {/* First row - 1st and 2nd images */}
            <div className="flex flex-col gap-2">
              <div className="Post w-[320px] h-[320px]">
                <img src={posts[0].post} alt={`Post 1`} className="w-full h-full object-cover" />
              </div>
              <div className="Post w-[320px] h-[320px]">
                <img src={posts[3].post} alt={`Post 4`} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="Post w-[320px] h-[320px]">
                <img src={posts[1].post} alt={`Post 2`} className="w-full h-full object-cover ml-2" />
              </div>
              <div className="Post w-[320px] h-[320px]">
                <img src={posts[4].post} alt={`Post 5`} className="w-full h-full object-cover ml-2" />
              </div>
            </div>

            {/* Reel spanning both rows */}
            <div className="Reels w-[320px] h-[646px] ml-4">
              <img src={posts[2].post} alt={`Reel 3`} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </>
  )
}


export default Explore;
