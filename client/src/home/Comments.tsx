// import React, { useState } from "react";
// import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/scrollbar";
// import image from "./images/Ellipse 74.png";
// import { IoMdStar, IoMdStarOutline } from "react-icons/io";
// import { useEffect } from "react";

// function Comments() {
//   const [windowSize, setWindowSize] = useState([
//     window.innerWidth,
//     window.innerHeight,
//   ]);

//   const slides = [1, 2, 3, 4, 5, 6];

//   useEffect(() => {
//     const handleWindowResize = () => {
//       setWindowSize([window.innerWidth, window.innerHeight]);
//     };

//     window.addEventListener("resize", handleWindowResize);

//     return () => {
//       window.removeEventListener("resize", handleWindowResize);
//     };
//   });

//   return (
//     <div className='container overflow-hidden mb-[200px] xl:w-11/12 m-auto'>
//       <div className='text-[#1C1B50] font-bold text-3xl text-center mt-[200px] lg:mt-[100px] md:mt-[50px] mb-[70px]'>
//         Sharhlar
//       </div>
//       <Swiper
//         // install Swiper modules
//         modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
//         spaceBetween={30}
//         centeredSlides={windowSize[0] <= 786 ? true : false}
//         slidesPerView={
//           windowSize[0] <= 565
//             ? 1
//             : windowSize[0] <= 786
//             ? 1.7
//             : windowSize[0] <= 1180
//             ? 2
//             : 3
//         }
//         autoplay={{
//           delay: 2000,
//           disableOnInteraction: true,
//         }}
//         speed={1200}
//       >
//         {slides.length &&
//           slides.map((slide, index) => (
//             <SwiperSlide key={index}>
//               <div className='bg-white border-2 border-[#E6E6E6] rounded-[30px] px-[40px] pt-[40px] pb-[30px] '>
//                 <div className='flex mb-[40px] items-center '>
//                   <img src={image} alt='' className='w-[50px] h-[50px]' />
//                   <div className='flex flex-col ml-[10px] text-[#1C1B50]'>
//                     <div className=' font-bold text-xl'>
//                       Palonchijon Pistonchiyev
//                     </div>
//                     <div className=' font-normal text-sm'>
//                       CEO “Bir narsa” learning center
//                     </div>
//                   </div>
//                 </div>
//                 <div className='text-[#1C1B50] font-bold xl:text-lg md:text-sm mb-[40px]'>
//                   “ManageMe — Bu har taraflama qulay bo‘lgan platforma sizga
//                   markazingizda tahsil olayotgan o‘quvchilar hamda ota-onalar
//                   uchun birdek ma’qul keladi.”
//                 </div>
//                 <div className='flex text-2xl text-[#18CB8A] gap-[15px]'>
//                   <IoMdStar />
//                   <IoMdStar />
//                   <IoMdStar />
//                   <IoMdStar />
//                   <IoMdStarOutline />
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//       </Swiper>
//     </div>
//   );
// }

// export default Comments;
