import React from "react";

interface YouTubeEmbedProps {
  src: string;
}

const YTvideo: React.FC<YouTubeEmbedProps> = ({ src }) => {
  return (
    <div className="video-container">
      <iframe
        width="700"
        height="400"
        src={src}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YTvideo;
