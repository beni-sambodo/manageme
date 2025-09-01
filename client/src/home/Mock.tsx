import  { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import headerimg from "../images/headerimg.png";
import userimg from "../images/user.png";
import play from "../images/play.png";

function Heading() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="container mx-auto mt-16 lg:w-11/12 xl:w-10/12 2xl:w-8/12">
        <div className="flex flex-col items-center">
          <div className="font-black text-4xl lg:text-5xl xl:text-6xl text-center">
            ManageMe — Ta’lim markazlari uchun qulay boshqaruv tizimi
          </div>
          <p className="text-lg xl:text-xl text-center leading-7 xl:leading-8 mt-8 xl:mt-10">
            O‘quv markazlarini boshqarishda barcha foydalanuvchilar hamda ta’lim
            markazlari uchun yangicha uslubdagi dastur
          </p>
          <button className="rounded-xl bg-blue-500 text-white py-3 px-8 mt-12 hover:bg-blue-600 transition-colors duration-900">
            Ro‘yxatdan o‘tish <FiArrowRight className="ml-3" />
          </button>
        </div>
        <div className="relative mt-16 lg:mt-20">
          {!isOpen ? (
            <div>
              <img src={headerimg} alt="" className="w-full rounded-lg shadow-lg" />
              <div className="absolute bottom-8 left-8 flex items-center space-x-4">
                <img src={userimg} alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-bold text-base lg:text-lg xl:text-xl">
                    Shohjaxon Sultonov
                  </div>
                  <div className="text-sm lg:text-base">
                    Dastur loyiha boshqaruvchisi
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="embed-responsive aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.youtube.com/embed/So6o-oph-6Y"
                  title="YouTube video player"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          {isOpen ? (
            ""
          ) : (
            <Link
              to="/"
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              onClick={() => setIsOpen(true)}
            >
              <img src={play} alt="" className="w-16 lg:w-20 xl:w-24 opacity-75 hover:opacity-100 transition-opacity duration-200 delay-200" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Heading;