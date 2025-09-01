
import logo from "./images/FooterLogo.png";
import { FaTelegram, FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className='py-10 bg-[#f4f4fc9d] pt-[70px]  xl:pt-[30px] flex flex-col justify-center items-center'>
      <div className='container flex items-start justify-between xl:w-10/12'>
        <div className='flex flex-col gap-[110px]'>
          <Link to='/'>
            <img src={logo} alt='' className='w-[100px] ' />
          </Link>
          <div className='text-[#1C1B50] font-medium text-lg md:hidden '>
            <span>Made by </span> <span className='font-bold'> Durbek Saydaliyev</span>
          </div>
        </div>
        <ul className='flex flex-col gap-[20px] md:hidden'>
          <li className='text-[#1C1B50] font-bold text-[22px]'>Aloqa</li>
          <li className='text-[#1C1B50] font-medium font-lg'>
            Jizzax, Sh,Rashidov shox k-si
          </li>
          <li className='text-[#1C1B50] font-medium font-lg'>
            +998 99 127 67 43
          </li>
          <li className='text-[#1C1B50] font-medium font-lg'>Uzbekistan</li>
          <li className='text-[#1C1B50] font-medium font-lg'>
            saydaliyevdurbek0512@gmail.com
          </li>
        </ul>
        <div>
          <div className='text-[#1C1B50] font-bold text-[22px] mb-[20px]'>
            Ijtimoiy tarmoqlar
          </div>
          <div className='flex text-2xl text-[#1C1B50] gap-[20px]'>
            <FaTelegram className='cursor-pointer' />
            <FaFacebook className='cursor-pointer ' />
            <FaInstagramSquare className='rounded-full cursor-pointer' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
