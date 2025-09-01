import { FiArrowRight } from "react-icons/fi"
import { Link } from "react-router-dom"

function LastPage() {
  return (
    <div className="container mx-auto px-4 py-[100px] md:py-[80px] sm:py-[60px] max-w-6xl">
      <h2 className="text-[#1C1B50] text-4xl md:text-3xl sm:text-2xl leading-tight font-black text-center mb-8 md:mb-6 sm:mb-4">
        ManageMeda oldindan to'lov qilmagan holda foydalanishingiz mumkin.
      </h2>

      <p className="text-[#1C1B50] text-xl md:text-lg sm:text-base font-medium text-center mb-12 md:mb-10 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
        Hech qanday demo versiyalardan foydalanishga hojat yo'q, platforma sifati sizga maqul kelsagina foydalanishni
        davom ettishiringiz mumkin.
      </p>

      <div className="flex items-center justify-center">
        <Link
          to={"/login"}
          className="flex items-center justify-center bg-indigo-500 text-white rounded-lg py-4 px-8 md:py-3 md:px-6 sm:py-3 sm:px-5 font-medium hover:bg-indigo-600 transition-colors duration-200 text-base md:text-sm"
        >
          Ro'yxatdan o'tish <FiArrowRight className="ml-3" />
        </Link>
      </div>
    </div>
  )
}

export default LastPage
