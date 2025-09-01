
import { FiArrowRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

function TariffBasket({ order, handleRemove }:any) {
  const textMiddle = "not-italic font-normal text-xl text-[#1C1B50] xl:text-xs";
  const textHead = "not-italic font-bold text-xl text-[#1C1B50] xl:text-xs";

  return (
    <div>
      <div className='bg-white border-[#E6E6E6] w-[447px] border-2 rounded-[40px] h-[1350px] xl:w-[220px] xl:h-[690px] xl:rounded-[20px] md:h-auto md:pb-5'>
        <div className='px-[40px] pt-[40px] border-b-[3px] border-[#E9E9E9] xl:px-[20px] xl:py-[20px] xl:border-b-1 md:border-none md:pb-0'>
          <div className='text-[#1C1B50] font-bold text-2xl mb-[30px] xl:mb-[15px] xl:text-xs md:mb-0 '>
            Tarif hisobi
          </div>
          <div className='border-[#1C1B50] border-[3px] w-[367px] border-dashed mb-[30px] xl:w-[180px] xl:border-2 xl:mb-[0px] md:hidden '></div>
          <div className='text-[#18CB8A] font-bold text-xl mb-[30px] xl:mb-[0px] xl:text-[10px] md:hidden '>
            Avtomatik qo‘shiluvchi funksiyalar
          </div>
          <div className=' md:hidden'>
            <div className={`mb-[10px] xl:mb-0  ${textMiddle}`}>
              Xabardor qilish xizmati
            </div>
            <div className={`mb-[20px] xl:mb-[10px]  ${textHead}`}>0.3 %</div>
            <div className='border-[#E6E6E6] border-2 w-[367px] mb-[20px] xl:mb-[10px] xl:w-[180px] xl:border-[1px] '></div>
          </div>
          <div className=' md:hidden'>
            <div className={`mb-[10px] xl:mb-0  ${textMiddle}`}>
              Men aloqadaman xizmati
            </div>
            <div className={`mb-[20px] xl:mb-[10px]  ${textHead}`}>0,2 %</div>
            <div className='border-[#E6E6E6] border-2 w-[367px] mb-[20px] xl:mb-[10px] xl:w-[180px] xl:border-[1px]  md:hidden'></div>
          </div>
          <div className=' md:hidden'>
            <div className={`mb-[10px] xl:mb-0  ${textMiddle}`}>
              Ota- onalar bilan aloqa xizmati
            </div>
            <div className={`mb-[20px] xl:mb-[10px]  ${textHead}`}>0,5 %</div>
          </div>
        </div>
        <div className='p-[40px] pt-[25px] xl:p-[20px] xl:pt-[15px] md:hidden'>
          <div className='text-[#218ECC] font-bold text-xl mb-[30px] xl:text-sm xl:mb-[0px]'>
            Siz tanlagan funksiyalar
          </div>

          {order?.map((item:any) => (
            <div key={item.id}>
              <div className='flex items-start justify-between'>
                <div className={`mb-[10px] xl:mb-0 ${textMiddle}`}>
                  {" "}
                  {item.name}
                </div>
                <IoClose
                  onClick={() => handleRemove()}
                  className='text-[28px] text-[#919696] cursor-pointer xl:text-xs'
                />
              </div>
              <div className={`mb-[20px] xl:mb-[10px] ${textHead}`}>
                {" "}
                {item.amount}{" "}
              </div>
              <div className='border-[#E6E6E6] border-2 w-[367px] mb-[20px] xl:mb-[10px] xl:w-[180px] xl:border-[1px]'></div>
            </div>
          ))}
        </div>
        <div className='border-[#1C1B50] border-[3px] w-[367px] border-dashed m-auto xl:w-[180px] xl:border-2  md:hidden '></div>
        <div className='px-[40px] pt-[30px] flex items-center justify-between xl:px-[20px] xl:pt-[10px] '>
          <div className='text-[#1C1B50] font-bold text-[28px] leading-[38px] xl:text-sm'>
            Narxi:
          </div>
          <div className='text-[#1C1B50]'>
            <span className='text-base font-normal xl:text-[8px]'>
              foydadan{" "}
            </span>{" "}
            <span className='font-bold text-[28px] leading-[38px] xl:text-sm'>
              {" "}
              2,4 %
            </span>
          </div>
        </div>
        <div className='px-[30px] flex items-center justify-center'>
          <button className='flex rounded-xl text-white bg-[#218ECC]  items-center justify-center w-[367px] h-[60px] mt-[25px] text-base hover:bg-blue-500 transition-colors duration-900 delay-200 xl:w-[180px] xl:h-[35px] xl:text-[10px] xl:mt-[5px] md:w-[292px] md:h-[42px] md:mt-5'>
            Tarifni rasmiylashtirish{" "}
            <FiArrowRight className='ml-3 xl:ml-[5px]' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TariffBasket;
