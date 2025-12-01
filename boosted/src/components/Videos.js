import React from 'react';

const Videos = ({ videos = [] }) => {
  return (
    <section className="videos">
      <div className="container">
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id || video.alt} className="video-card" title={video.title || video.alt}>
              <img src={video.image} alt={video.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Videos;

