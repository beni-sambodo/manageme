"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import Logo from "../assets/Logo.png"
import logo2 from "./images/0123 2.png"
import { FaBars, FaTimes } from "react-icons/fa"
import { BsGlobe2 } from "react-icons/bs"

function Header() {
  const [isOpenNav, setIsOpenNav] = useState(false)

  const dotClass = `${!isOpenNav ? "md:bg-white" : "bg-black"} w-[5px] h-[5px] rounded-[50%] mt-1 hidden group-hover:block`
  const navItemClass = "hover:font-bold flex flex-col items-center group transition-all duration-100 delay-75"

  return (
    <>
      <div className="w-full m-auto bg-[#fffffff1] sticky top-0 z-10">
        <div className="container flex h-[124px] items-center justify-between mx-auto px-4 xl:w-11/12 md:h-[85px]">
          <Link to="/" className="flex items-center">
            <img src={Logo || "/placeholder.svg"} className="w-[44px]" alt="Logo" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex h-full items-center justify-between gap-7">
            <div className={navItemClass}>
              <Link to="#">Asosiy</Link>
              <div className={dotClass}></div>
            </div>
            <div className={navItemClass}>
              <Link to="#">Video tushuncha</Link>
              <div className={dotClass}></div>
            </div>
            <div className={navItemClass}>
              <Link to="#">Afzalliklar</Link>
              <div className={dotClass}></div>
            </div>
            <div className={navItemClass}>
              <Link to="#">Tariflar</Link>
              <div className={dotClass}></div>
            </div>
            <div className={navItemClass}>
              <Link to="#">Aloqa</Link>
              <div className={dotClass}></div>
            </div>
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center justify-center gap-3 text-[#1C1B50]">
            <Link
              to={"/login"}
              className="px-4 py-2 bg-indigo-500 rounded text-white hover:bg-indigo-800 transition-colors"
            >
              Kirish
            </Link>
            <div className="flex border p-2 rounded">
              <BsGlobe2 />
              <select name="" id="" className="bg-transparent outline-none">
                <option value="">UZ</option>
                <option value="">RU</option>
                <option value="">EN</option>
              </select>
            </div>
          </div>

          {/* Mobile Right Side */}
          <div className="flex lg:hidden items-center gap-3">
            <Link to={"/login"} className="px-3 py-2 bg-indigo-500 rounded text-white hover:bg-indigo-800 text-sm">
              Kirish
            </Link>
            <button className="text-[24px] text-[#1C1B50]" onClick={() => setIsOpenNav(!isOpenNav)}>
              {isOpenNav ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Navigation Overlay */}
          {isOpenNav && (
            <nav className="lg:hidden fixed inset-0 bg-[#218dcc] text-white z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <img src={logo2 || "/placeholder.svg"} alt="Logo" className="h-8" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <BsGlobe2 />
                    <select className="bg-transparent text-white outline-none">
                      <option value="" className="text-black">
                        UZ
                      </option>
                      <option value="" className="text-black">
                        RU
                      </option>
                      <option value="" className="text-black">
                        EN
                      </option>
                    </select>
                  </div>
                  <button className="text-[24px]" onClick={() => setIsOpenNav(false)}>
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-6 p-6 flex-1">
                <Link to="#" className="text-lg font-medium" onClick={() => setIsOpenNav(false)}>
                  Asosiy
                </Link>
                <Link to="#" className="text-lg font-medium" onClick={() => setIsOpenNav(false)}>
                  Video tushuncha
                </Link>
                <Link to="#" className="text-lg font-medium" onClick={() => setIsOpenNav(false)}>
                  Afzalliklar
                </Link>
                <Link to="#" className="text-lg font-medium" onClick={() => setIsOpenNav(false)}>
                  Tariflar
                </Link>
                <Link to="#" className="text-lg font-medium" onClick={() => setIsOpenNav(false)}>
                  Aloqa
                </Link>
              </div>

              <div className="p-6 border-t border-white/20 text-center space-y-2">
                <div>+998 93 302 67 27</div>
                <div>Jizzax, Sh,Rashidov shox ko'chasi</div>
                <div>Uzbekistan</div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </>
  )
}

export default Header
