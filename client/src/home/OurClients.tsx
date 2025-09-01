// 
// import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useEffect, useState } from "react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/scrollbar";
// import image1 from "./images/Brands/25287_logo_amazon.png";
// import image2 from "./images/Brands/25351_logo_apple.png";
// import image3 from "./images/Brands/26141_logo_netflix.png";
// import image4 from "./images/Brands/30088_logo_spotify.png";
// import image5 from "./images/Brands/71620_logo_peloton.png";
// import image6 from "./images/Brands/73173_logo_costco.png";
// import image7 from "./images/Brands/google-logo.png";

// function OurClients() {
//   const imageStyle =
//     "w-[328px] h-[150px] border-2 border-[#E6E6E6] bg-white rounded-[12px] flex items-center justify-center xl:w-[160px] xl:h-[73px]";
//   const imageStyle1 =
//     "w-[100px] border-2 rounded-full object-fill xl:w-[50px] ";

//   const [windowSize, setWindowSize] = useState([
//     window.innerWidth,
//     window.innerHeight,
//   ]);

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
//     <div className='container xl:w-11/12'>
//       <div className='text-[#1C1B50] font-bold text-3xl text-center mt-[200px] lg:mt-[100px] lg:mb-[50px] mb-[70px]'>
//         Bizning mijozlar
//       </div>
//       <Swiper
//         // install Swiper modules
//         modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
//         spaceBetween={true}
//         centeredSlides={windowSize[0] <= 330 ? true : false}
//         slidesPerView={
//           windowSize[0] <= 330
//             ? 1.5
//             : windowSize[0] <= 565
//             ? 2
//             : windowSize[0] <= 768
//             ? 3
//             : 4
//         }
//         autoplay={{
//           delay: 2000,
//           disableOnInteraction: true,
//         }}
//         speed={1200}
//       >
//         <SwiperSlide>
//           <div className={imageStyle}>
//             <img src={image1} alt='' className={imageStyle1} />
//           </div>
//         </SwiperSlide>
//         <SwiperSlide>
//           <div className={imageStyle}>
//             <img src={image2} alt='' className={imageStyle1} />
//           </div>
//         </SwiperSlide>
//         <SwiperSlide>
//           <div className={imageStyle}>
//             <img src={image3} alt='' className={imageStyle1} />
//           </div>
//         </SwiperSlide>
//         <SwiperSlide>
//           <div className={imageStyle}>
//             <img src={image4} alt='' className={imageStyle1} />
//           </div>
//         </SwiperSlide>
//         <SwiperSlide>
//           <div className={imageStyle}>
//             <img src={image5} alt='' className={imageStyle1} />
//           </div>
//         </SwiperSlide>
//         <SwiperSlide>
//           <div className={imageStyle}>
//             <img src={image6} alt='' className={imageStyle1} />
//           </div>
//         </SwiperSlide>
//         <SwiperSlide>
//           <div className={imageStyle}>
//             <img src={image7} alt='' className={imageStyle1} />
//           </div>
//         </SwiperSlide>
//       </Swiper>
//     </div>
//   );
// }

// export default OurClients;
