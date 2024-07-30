import React from "react";
import "./css/font.css";

const RakhiPackaging = () => {
  return (
    <>
      <div className="bg-white my-10 w-full shadow-2xl mt-3">
        <h2 className="text-left p-10 text-3xl font-medium">
          Diva's Special Raksha Bandhan Packaging
        </h2>
        <div className="flex items-center justify-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 rounded-[17px] custom-shadow m-10 py-5 px-10 w-fit">
            <div id="video-player">
              <video width="500" className="w-[15rem]" controls autoPlay>
                <source
                  src={`https://divatheindianjewel.com/promo%20videos/rakhi%20ads.mp4`}
                  type="video/mp4"
                />
              </video>
            </div>

            <div id="content">
              <div className="headers">
                <h1 className="capitalize text-xl font-bold text-center mb-2 roboto-medium">
                  Here we present Diva's Rakhi Special Packaging
                </h1>

                <h2 className="capitalize text-xl font-semibold w-[50rem] mt-1 text-start">
                  Diva will provide you all the important Things Needed To show
                  your love towards your brother
                </h2>

                <div className="poppins-semibold my-4 text-start">
                  <h3 className="capitalize text-lg font-semibold my-2">
                    What will you get in our rakhi special box
                  </h3>
                  <ol className="flex flex-col gap-3 mx-3">
                    <li> Box item - 1 </li> <li> Box item - 2 </li>
                    <li> Box item - 3 </li> <li> Box item - 4 </li>
                  </ol>
                </div>

                <p className="poppins-medium text-base text-start">
                  To Celebrate the unbreakable bond with our brothers this
                  Raksha Bandhan! <br />
                  If your away from home and want to Celebrate Raksha Bandhan
                  with your
                  <br />
                  <p className="">
                    {" "}
                    Here We are, Celebrate This Raksha Bandhan with our Special
                    Rakhi's Packing{" "}
                  </p>
                </p>

                <button
                  className="myBtn py-2 product mt-4 text-base font-semibold"
                  type="button"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RakhiPackaging;
