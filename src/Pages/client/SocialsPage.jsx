import React from "react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";

export default function SocialsPage() {
  return (
    <div className="2xl:container 2xl:mx-auto md:py-12 lg:px-20 md:px-6 py-3 px-4">
      {/* Heading Section */}
      <div className="text-center">
        <h2 className="font-semibold lg:text-4xl text-3xl lg:leading-9 md:leading-7 leading-9 text-gray-800 md:w-full w-9/12 mx-auto">
          Follow Us on Social Media
        </h2>
        <p className="font-normal text-base leading-6 text-gray-600 mt-4 lg:w-5/12 md:w-9/12 mx-auto">
          Follow us on your favorite social media platforms and stay connected with us. Click the icons to get in touch!
        </p>
      </div>

      {/* Social Icons Section */}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-8 md:gap-6 gap-4 mt-10">
        {/* WhatsApp Icon */}
        <div className="relative group">
          <div className="w-full h-40 flex justify-center items-center bg-green-500 rounded-xl transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-lg">
            <FaWhatsapp className="text-white text-6xl" />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black opacity-0 group-hover:opacity-40 transition-all duration-300 rounded-xl"></div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold text-xl"
            >
              Chat with us
            </a>
          </div>
        </div>

        {/* Instagram Icon */}
        <div className="relative group">
          <div className="w-full h-40 flex justify-center items-center bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-lg">
            <FaInstagram className="text-white text-6xl" />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black opacity-0 group-hover:opacity-40 transition-all duration-300 rounded-xl"></div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href="https://instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold text-xl"
            >
              Follow us on Instagram
            </a>
          </div>
        </div>

        {/* Facebook Icon */}
        <div className="relative group">
          <div className="w-full h-40 flex justify-center items-center bg-blue-600 rounded-xl transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-lg">
            <FaFacebook className="text-white text-6xl" />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black opacity-0 group-hover:opacity-40 transition-all duration-300 rounded-xl"></div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href="https://facebook.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold text-xl"
            >
              Like us on Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
