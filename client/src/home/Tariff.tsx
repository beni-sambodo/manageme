import Tariffs from "./Tariffs";

function Tariff() {
  return (
    <div className='container'>
      <div className='text-[#1C1B50] font-bold text-3xl text-center mt-[100px] lg:mt-[50px] lg:text-base'>
        Tariflar
      </div>
      <div>
        <p className='text-[#1C1B50] font-medium text-xl text-center w-[1041px] m-auto mt-[20px] mb-[50px] lg:text-sm lg:w-10/12 md:w-11/12'>
          Maksimal effektli natijaga erishish uchun maqbul ta'riflarni
          tanlashingiz mumkin.
        </p>
      </div>
      <Tariffs />
    </div>
  );
}

export default Tariff;
