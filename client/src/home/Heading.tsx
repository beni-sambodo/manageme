"use client"

import { useState } from "react"
import { FiArrowRight } from "react-icons/fi"
import headerimg from "./images/headerimg.png"
import userimg from "./images/user.png"
import play from "./images/play.png"
import { Link } from "react-router-dom"

function Heading() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="container mx-auto px-4 flex flex-col items-center pt-[120px] lg:pt-[70px] md:pt-[50px] sm:pt-[35px] max-w-7xl">
        <div className="flex items-center justify-center flex-col gap-6 md:gap-8 lg:gap-10">
          <h1 className="font-black text-4xl md:text-5xl lg:text-6xl text-center leading-tight sm:text-2xl">
            ManageMe — Ta'lim markazlari va talabalar uchun maxsus platforma.
          </h1>
          <p className="w-full max-w-4xl text-center font-medium text-lg md:text-xl leading-relaxed sm:text-base px-4">
            3 modulli gibrid platforma, Manageme.uz, Centers.uz va markazlar uchun yaratiladigan maxsus sayt.
          </p>
          <Link
            to={"/login"}
            className="flex rounded-xl text-white bg-indigo-500 items-center justify-center px-8 py-4 mt-6 hover:bg-indigo-600 transition-colors duration-200 text-base font-medium"
          >
            Ro'yxatdan o'tish <FiArrowRight className="ml-3" />
          </Link>
        </div>

        {isOpen ? (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <button
                className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
              {/* Video content would go here */}
              <div className="bg-gray-800 aspect-video rounded-lg flex items-center justify-center text-white">
                Video Player Placeholder
              </div>
            </div>
          </div>
        ) : (
          <div className="relative mt-12 lg:mt-16 w-full max-w-5xl">
            <div className="relative">
              <img
                src={headerimg || "/placeholder.svg"}
                alt="Platform preview"
                className="w-full rounded-lg shadow-lg"
              />

              <div className="absolute bottom-4 left-4 flex items-center space-x-4 bg-white py-3 px-4 rounded-lg shadow-lg sm:relative sm:left-0 sm:bottom-0 sm:mt-4 sm:bg-transparent sm:shadow-none">
                <img src={userimg || "/placeholder.svg"} alt="User" className="w-12 h-12 rounded-full flex-shrink-0" />
                <div>
                  <div className="font-bold text-base sm:text-sm">Shohjaxon Sultonov</div>
                  <div className="text-sm text-gray-600 sm:text-xs">Dastur loyiha boshqaruvchisi</div>
                </div>
              </div>
            </div>

            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:top-1/2"
              onClick={() => setIsOpen(true)}
            >
              <img
                src={play || "/placeholder.svg"}
                alt="Play video"
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-75 hover:opacity-100 transition-opacity duration-200"
              />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Heading
