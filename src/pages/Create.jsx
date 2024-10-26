import React, { useState } from 'react';

const Create = () => {
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [mediaType, setMediaType] = useState('');

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(reader.result);
        setMediaType(file.type.startsWith('image/') ? 'image' : 'video');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const newPost = { media, caption, mediaType };
    const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
    localStorage.setItem('posts', JSON.stringify([...existingPosts, newPost]));
    setMedia(null);
    setCaption('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a New Post</h2>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
          />
          {media && mediaType === 'image' && (
            <img
              src={media}
              alt="Selected"
              className="w-full h-auto rounded-lg object-cover max-h-60 mb-4"
            />
          )}
          {media && mediaType === 'video' && (
            <video
              src={media}
              className="w-full h-auto rounded-lg max-h-60 mb-4"
              controls
            />
          )}
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none mb-4"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => { setMedia(null); setCaption(''); }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
