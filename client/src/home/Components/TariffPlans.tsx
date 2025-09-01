import { useState } from "react";
import Toggle from "./Toggle";

function TariffPlans({ data, handleClick, handleRemove }:any) {
  const textHead = "not-italic font-bold text-xl text-[#1C1B50] xl:text-xs";

  const [isSelected, setIsSelected] = useState(false);

  const { name, info, amount } = data;
  return (
    <div>
      <div className='w-[446px] h-[248px] bg-white border-[#E6E6E6] border-2 rounded-[40px] xl:w-[220px] xl:h-[160px] xl:rounded-[14px] xl:border-1'>
        <div className='p-[30px] border-b-[3px] pb-[35px] xl:p-[15px] xl:pb-[10px] xl:border-b-[1px]'>
          <div className={"mb-[15px] xl:mb-[10px] " + textHead}>{name}</div>
          <p className='not-italic font-medium text-sm leading-[150%] text-[#53528A] xl:text-[10px]'>
            {info}
          </p>
        </div>
        <div className='px-[30px] flex items-center justify-between mt-[24px] xl:mt-[12px] xl:px-[15px]'>
          <div className={textHead}>
            <span className='font-normal'>narxi</span> <span>{amount}</span>
          </div>
          {!isSelected ? (
            <button onClick={() => handleClick(data)}>
              <Toggle isSelected={isSelected} setIsSelected={setIsSelected} />
            </button>
          ) : (
            <button onClick={() => handleRemove()}>
              <Toggle isSelected={isSelected} setIsSelected={setIsSelected} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TariffPlans;
