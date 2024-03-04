import React from "react";
import Link from "next/link";
import Image from "next/image";

// images
import Logo from "@/app/assets/logo.png";
import insta from "@/app/assets/social icons/insta.png";
import fb from "@/app/assets/social icons/fb.png";
import yt from "@/app/assets/social icons/yt.png";

const Footer = () => {
  const iconsHeight = 40;
  const iconsWidth = 30;

  const instagramID = "https://www.instagram.com/diva.theindianjewel/";
  const faceBookID = "https://www.instagram.com/diva.theindianjewel/";
  const youtubeId = "https://www.instagram.com/diva.theindianjewel/";

  return (
    <div className="bg-black">
      <footer className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-16 grid grid-cols-2 gap-12 pt-10 md:grid-cols-4 lg:grid-cols-6 lg:gap-8 lg:pt-12">
          <div className="col-span-full lg:col-span-2">
            {/* logo - start */}
            <div className="mb-4 lg:-mt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xl font-bold text-gray-100 md:text-2xl"
                aria-label="logo"
              >
                <Image src={Logo} alt="Logo" height={95} width={195} />
              </Link>
            </div>
            {/* logo - end */}
            <p className="mb-6 text-gray-400 sm:pr-8">
              Filler text is dummy text which has no meaning however looks very
              similar to real text.
            </p>
            {/* social - start */}
            <div className="flex gap-4 items-center justify-center">
              <Link href={faceBookID}>
                <Image
                  src={fb}
                  alt="Facebook"
                  height={iconsHeight}
                  width={iconsWidth}
                />{" "}
              </Link>
              <Link href={instagramID}>
                <Image
                  src={insta}
                  alt="instagram"
                  height={iconsHeight}
                  width={iconsWidth}
                />
              </Link>
              <Link href={youtubeId}>
                <Image
                  src={yt}
                  alt="youtube"
                  height={iconsHeight}
                  width={iconsWidth}
                />
              </Link>
            </div>
            {/* social - end */}
          </div>
          {/* nav - start */}
          <div>
            <div className="mb-4 font-bold uppercase tracking-widest text-gray-100">
              Products
            </div>
            <nav className="flex flex-col gap-4">
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Overview
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Solutions
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Pricing
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Customers
                </a>
              </div>
            </nav>
          </div>
          {/* nav - end */}
          {/* nav - start */}
          <div>
            <div className="mb-4 font-bold uppercase tracking-widest text-gray-100">
              Company
            </div>
            <nav className="flex flex-col gap-4">
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  About
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Investor Relations
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Jobs
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Press
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Blog
                </a>
              </div>
            </nav>
          </div>
          {/* nav - end */}
          {/* nav - start */}
          <div>
            <div className="mb-4 font-bold uppercase tracking-widest text-gray-100">
              Support
            </div>
            <nav className="flex flex-col gap-4">
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Contact
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Documentation
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Chat
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  FAQ
                </a>
              </div>
            </nav>
          </div>
          {/* nav - end */}
          {/* nav - start */}
          <div>
            <div className="mb-4 font-bold uppercase tracking-widest text-gray-100">
              Legal
            </div>
            <nav className="flex flex-col gap-4">
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Terms of Service
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Privacy Policy
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="text-gray-400 transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                >
                  Cookie settings
                </a>
              </div>
            </nav>
          </div>
          {/* nav - end */}
        </div>
        <div className="border-t border-gray-800 py-8 text-center text-sm text-gray-400">
          © 2024 - Present Diva the indian jewel. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
