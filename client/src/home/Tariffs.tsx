import icon1 from "./images/image 3.png"
import icon2 from "./images/image 1.png"
import icon3 from "./images/image 2.png"
import checked from "./images/Frame.png"
import { FiArrowRight } from "react-icons/fi"
import { Link } from "react-router-dom"

function Tariffs() {
  const tarifs = [
    {
      image: icon1,
      name: "Start",
      price: 77000,
      valut: "UZS",
      data: [
        "150+ talaba",
        "Suniy Intellekt bilan o'sish tahlili",
        "Online qabul",
        "SMS yuborish",
        "To'lovlar nazorati",
        "Centers.uzga integratsiya",
        "Maxsus sayt yaratish",
      ],
      bg: "bg-white",
      color: "text-[#1E1E1E]",
    },
    {
      image: icon2,
      name: "Ommaviy",
      price: 149000,
      valut: "UZS",
      data: [
        "250+ talaba",
        "Suniy Intellekt bilan o'sish tahlili",
        "Online qabul",
        "SMS yuborish",
        "To'lovlar nazorati",
        "Centers.uzga integratsiya",
        "Maxsus sayt yaratish",
      ],
      bg: "bg-[#2F2F2F]",
      color: "text-white",
      popular: true,
    },
    {
      image: icon3,
      name: "Pro",
      price: 299000,
      valut: "UZS",
      data: [
        "500+ talaba",
        "Suniy Intellekt bilan o'sish tahlili",
        "Online qabul",
        "SMS yuborish",
        "To'lovlar nazorati",
        "Centers.uzga integratsiya",
        "Maxsus sayt yaratish",
      ],
      bg: "bg-white",
      color: "text-[#1E1E1E]",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-[70px] md:py-[50px] sm:py-[40px] max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 justify-items-center">
        {tarifs.map((tarif, index) => (
          <div
            key={index}
            className={`${tarif.bg} ${tarif.color} w-full max-w-[400px] border-8 md:border-4 rounded-[40px] md:rounded-[30px] sm:rounded-[20px] border-white p-8 md:p-6 sm:p-4 shadow-2xl shadow-pink-200 relative`}
          >
            {tarif.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#218ECC] text-white px-4 py-2 rounded-full text-sm font-medium">Ommaviy</div>
              </div>
            )}

            <div className="flex items-center mb-6 md:mb-4">
              <img
                src={tarif.image || "/placeholder.svg"}
                alt={tarif.name}
                className="w-[80px] h-[80px] md:w-[60px] md:h-[60px] sm:w-[50px] sm:h-[50px] mr-5 md:mr-4 object-contain"
              />
              <div>
                <h3 className="font-bold text-2xl md:text-xl sm:text-lg mb-2">{tarif.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#A3A3A3] font-bold text-xs">{tarif.valut}</span>
                  <span className="font-bold text-2xl md:text-xl sm:text-lg">{tarif.price.toLocaleString()}</span>
                  <span className="text-[#A3A3A3] font-bold text-xs">/ oy</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 my-6 md:my-4"></div>

            <div className="space-y-4 md:space-y-3 sm:space-y-2 mb-8 md:mb-6 sm:mb-4">
              {tarif.data.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start gap-3 md:gap-2">
                  <img
                    src={checked || "/placeholder.svg"}
                    alt="Checked"
                    className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5"
                  />
                  <span className="font-bold text-lg md:text-base sm:text-sm leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to={"/login"}
              className="flex items-center justify-center w-full bg-[#218ECC] text-white rounded-xl py-4 md:py-3 sm:py-2 font-medium hover:bg-blue-600 transition-colors duration-200 text-base md:text-sm"
            >
              Boshlash <FiArrowRight className="ml-2" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tariffs
