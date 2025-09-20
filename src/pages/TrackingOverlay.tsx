import React, { useState, useEffect, useRef } from 'react';

interface Zone {
  zone_name: string;
  zone_type: string;
  polygon: number[][];
}

interface TrackingData {
  frame: number;
  timestamp: number;
  bbox: number[]; // [x1, y1, x2, y2]
  zone: string;
}

interface TrackingMetadata {
  zones: Zone[];
  tracked_objects: TrackingData[];
}

const TrackingOverlay: React.FC = () => {
  const [trackingData, setTrackingData] = useState<TrackingMetadata | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load tracking data
  useEffect(() => {
    fetch('/tracked_with_metadata.json')
      .then(response => response.json())
      .then(data => setTrackingData(data))
      .catch(error => console.error('Error loading tracking data:', error));
  }, []);

  // Update canvas overlay
  useEffect(() => {
    if (!trackingData || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw zones
    trackingData.zones.forEach(zone => {
      ctx.strokeStyle = zone.zone_type === 'Rack' ? '#00ff00' : '#ff0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      zone.polygon.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });
      ctx.closePath();
      ctx.stroke();

      // Draw zone label
      const centerX = zone.polygon.reduce((sum, point) => sum + point[0], 0) / zone.polygon.length;
      const centerY = zone.polygon.reduce((sum, point) => sum + point[1], 0) / zone.polygon.length;
      ctx.fillStyle = zone.zone_type === 'Rack' ? '#00ff00' : '#ff0000';
      ctx.font = '14px Arial';
      ctx.fillText(zone.zone_name, centerX, centerY);
    });

    // Draw current tracking objects
    const currentObjects = trackingData.tracked_objects.filter(obj => obj.frame === currentFrame);
    currentObjects.forEach(obj => {
      const [x1, y1, x2, y2] = obj.bbox;
      
      // Draw bounding box
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      
      // Draw zone indicator
      ctx.fillStyle = '#ffff00';
      ctx.font = '12px Arial';
      ctx.fillText(obj.zone, x1, y1 - 5);
    });
  }, [trackingData, currentFrame]);

  // Handle video time update
  const handleTimeUpdate = () => {
    if (!trackingData || !videoRef.current) return;
    
    const video = videoRef.current;
    const currentVideoTime = video.currentTime;
    setCurrentTime(currentVideoTime);
    
    // Find closest frame based on timestamp
    const closestFrame = trackingData.tracked_objects.reduce((closest, obj) => {
      return Math.abs(obj.timestamp - currentVideoTime) < Math.abs(closest.timestamp - currentVideoTime) ? obj : closest;
    });
    
    setCurrentFrame(closestFrame.frame);
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Seek to specific time
  const seekToTime = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Video Tracking Overlay
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-auto"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls
              >
                <source src="/Original Video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Overlay Canvas */}
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            
            {/* Video Controls */}
            <div className="mt-4 flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={videoRef.current?.duration || 0}
                  value={currentTime}
                  onChange={(e) => seekToTime(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <span className="text-sm text-muted-foreground">
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
              </span>
            </div>
          </div>
          
          {/* Tracking Info Panel */}
          <div className="space-y-6">
            {/* Current Frame Info */}
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Current Frame</h3>
              <div className="space-y-2 text-sm">
                <div>Frame: {currentFrame}</div>
                <div>Time: {currentTime.toFixed(2)}s</div>
                <div>Playing: {isPlaying ? 'Yes' : 'No'}</div>
              </div>
            </div>
            
            {/* Zones */}
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Zones</h3>
              <div className="space-y-2">
                {trackingData?.zones.map((zone, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className={`w-3 h-3 rounded ${
                        zone.zone_type === 'Rack' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-sm">{zone.zone_name}</span>
                    <span className="text-xs text-muted-foreground">({zone.zone_type})</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Current Tracking Objects */}
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Current Objects</h3>
              <div className="space-y-2">
                {trackingData?.tracked_objects
                  .filter(obj => obj.frame === currentFrame)
                  .map((obj, index) => (
                    <div key={index} className="text-sm p-2 bg-muted rounded">
                      <div>Zone: {obj.zone}</div>
                      <div>Bbox: [{obj.bbox.join(', ')}]</div>
                      <div>Timestamp: {obj.timestamp.toFixed(2)}s</div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Statistics */}
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div>Total Zones: {trackingData?.zones.length || 0}</div>
                <div>Total Frames: {trackingData?.tracked_objects.length || 0}</div>
                <div>Current Objects: {
                  trackingData?.tracked_objects.filter(obj => obj.frame === currentFrame).length || 0
                }</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingOverlay;
