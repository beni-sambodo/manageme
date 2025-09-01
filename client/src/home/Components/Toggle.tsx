function Toggle({ isSelected, setIsSelected }:any) {
  return (
    <div
      onClick={() => setIsSelected(!isSelected)}
      className={`
        "w-[54px] h-[29px]  rounded-full flex items-center p-[4px] transition-all duration-500 xl:w-[49px] xl:h-[25px] ${
          isSelected ? "bg-blue-500" : "bg-[#F0F0F0]"
        }
        `}
    >
      <span
        className={`
          w-[21px] h-[21px] rounded-full  transition-all duration-500 shadow-lg xl:w-[17px] xl:h-[17px]
          
          ${isSelected ? "ml-[25px]" : "bg-white"} 
          
        `}
      ></span>
    </div>
  );
}

export default Toggle;
