import React, { useState } from 'react';

const VideoTest = () => {
  const [videoType, setVideoType] = useState<'original' | 'processed'>('processed');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoSources = {
    original: "/Original Video - Manufacturing.mp4",
    processed: "/processed-manufacturing.mp4"
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    let errorMessage = 'Unknown error';
    
    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = 'Video loading was aborted';
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error occurred while loading video';
          break;
        case error.MEDIA_ERR_DECODE:
          errorMessage = 'Video decoding error';
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video format not supported or file not found';
          break;
        default:
          errorMessage = `Video error code: ${error.code}`;
      }
    }
    
    setVideoError(errorMessage);
    console.error('Video Error Details:', {
      error,
      src: video.src,
      networkState: video.networkState,
      readyState: video.readyState
    });
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setVideoError(null);
    console.log('Video loaded successfully:', videoSources[videoType]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Video Loading Test</h1>
        
        {/* Video Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setVideoType('original')}
              className={`px-4 py-2 rounded ${
                videoType === 'original' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Original Video
            </button>
            <button
              onClick={() => setVideoType('processed')}
              className={`px-4 py-2 rounded ${
                videoType === 'processed' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Processed Video
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>Current Source:</strong> {videoSources[videoType]}</p>
            <p><strong>Status:</strong> {videoLoaded ? '✅ Loaded' : '⏳ Loading...'}</p>
            {videoError && <p><strong>Error:</strong> <span className="text-red-600">{videoError}</span></p>}
          </div>
        </div>

        {/* Video Element */}
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            key={videoType}
            className="w-full h-96 object-contain"
            controls
            muted
            onLoadStart={() => {
              console.log('Video load started:', videoSources[videoType]);
              setVideoLoaded(false);
              setVideoError(null);
            }}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onCanPlay={() => console.log('Video can play:', videoSources[videoType])}
            onLoadedMetadata={() => console.log('Video metadata loaded:', videoSources[videoType])}
          >
            <source src={videoSources[videoType]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Debug Information */}
        <div className="mt-6 p-4 bg-gray-200 rounded">
          <h3 className="font-bold mb-2">Debug Information:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Available Files:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>/Original Video - Manufacturing.mp4</li>
              <li>/processed-manufacturing.mp4</li>
              <li>/Processed Video - Manufacturing.mp4</li>
            </ul>
            <p className="mt-2"><strong>Test Instructions:</strong></p>
            <ul className="list-disc list-inside ml-4">
              <li>Try switching between Original and Processed</li>
              <li>Check browser console for detailed logs</li>
              <li>Check Network tab to see if file requests are made</li>
              <li>Look for any 404 or other HTTP errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTest;
