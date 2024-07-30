import React from "react";
import ReactPlayer from "react-player";



const Page = () => {
  return (
    <div>
      <div className="player-wrapper">
        <ReactPlayer
          className="react-player"
          url={``}
          width="100%"
          height="100%"
          controls
        />
      </div>
    </div>
  );
};

export default Page;
