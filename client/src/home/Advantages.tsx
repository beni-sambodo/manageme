import icon1 from "./images/icon1.png"
import icon2 from "./images/icon2.png"
import icon3 from "./images/icon3.png"
import icon4 from "./images/icon4.png"
import icon5 from "./images/icon5.png"

function Advantages() {
  const advantages = [
    {
      icon: icon1,
      title: "Oson boshqariluvchi o'quvchilar bazasi",
    },
    {
      icon: icon2,
      title: "Oylik hisobotlarni avtomatlashtirish",
    },
    {
      icon: icon3,
      title: "Barcha qurilmalarda moslashuvchanlik",
    },
    {
      icon: icon4,
      title: "Ishonchli xavfsizlik faoliyati",
    },
    {
      icon: icon5,
      title: "Ota - onalar nazorati",
    },
  ]

  return (
    <div className="container mx-auto px-4 flex flex-col items-center pt-[100px] md:pt-[80px] sm:pt-[60px] pb-[100px] md:pb-[80px] sm:pb-[60px] max-w-7xl">
      <h2 className="font-bold text-center text-3xl md:text-2xl sm:text-xl mb-[50px] md:mb-[40px] sm:mb-[30px] text-[#1C1B50] max-w-4xl">
        Dasturda quyidagi afzalliklar mavjud
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 md:gap-6 sm:gap-4 w-full max-w-6xl">
        {advantages.map((advantage, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-4">
            <img
              src={advantage.icon || "/placeholder.svg"}
              alt={advantage.title}
              className="w-[80px] h-[80px] md:w-[70px] md:h-[70px] sm:w-[60px] sm:h-[60px] object-contain"
            />
            <p className="font-bold text-lg md:text-base sm:text-sm text-[#1C1B50] leading-tight">{advantage.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Advantages
