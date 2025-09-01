import icon1 from "./images/Password Security.png"
import icon2 from "./images/Money Bag.png"
import icon3 from "./images/Compress.png"
import icon4 from "./images/Translation.png"
import icon5 from "./images/Fast Forward.png"
import icon6 from "./images/Bookmark.png"

function Opportunities() {
  const opportunities = [
    {
      icon: icon1,
      title: "Mijozlar bazasi xavfsizligi",
      description:
        "Ish faoliyatni cheklamasdan, menejerlar tomonidan ko'chirish hamda o'g'irlash imkoniyatini o'chirib qo'yish",
    },
    {
      icon: icon2,
      title: "Sotuv hajmini oshirish imkoniyati",
      description:
        "Sotuv bo'limi ishining aniq tasviri, nimani yaxshilash mumkinligi, qayerda muammolar borligi va ularni qanday tuzatish kerakligi bilish, natijada sotuvlarni bir necha bor oshirish imkoniyati",
    },
    {
      icon: icon3,
      title: "Markaz veb sayti bilan integratsiya",
      description:
        "Ushbu dastur hamda markazingiz veb sayti integratsiya qilinadi hamda ayrim ma'lumotlarni boshqarish uchun \"Manage me\" dasturini o'zidan foydalanishingiz mumkin",
    },
    {
      icon: icon4,
      title: "Ko'p tillik interfeys",
      description: "Dasturda siz o'zbek, rus, ingliz, qozoq, qirg'iz hamda boshqa har qanday tillarda foydalana olasiz",
    },
    {
      icon: icon5,
      title: "Ishlash tezligi hamda qulayligi",
      description:
        "Istalgan qurilmada foydalanish uchun moslashuvchan tizim. Mobil, tablet hamda har qanday kompyuterda tezda yuklanadi va faqat bitta tugmani bosish orqali dasturni ishlatish mumkin",
    },
    {
      icon: icon6,
      title: "Onlayn statistika",
      description:
        "Real vaqt rejimida markazning barcha o'quvchilar soni, guruhlar, kurslar, kursga qabulga yozilganlar kabi barcha statistik ma'lumotlarini kuzatib borish",
    },
  ]

  return (
    <div className="container mx-auto px-4 flex flex-col items-center pt-[100px] md:pt-[80px] sm:pt-[60px] max-w-7xl">
      <h2 className="font-bold text-3xl md:text-2xl sm:text-xl text-center text-[#1C1B50] mb-6">
        Qo'shimcha imkoniyatlar
      </h2>
      <p className="font-medium text-xl md:text-lg sm:text-base text-center text-[#1C1B50] max-w-4xl mb-[70px] md:mb-[50px] sm:mb-[40px]">
        Dasturdan foydalanish davomida qulaylik hamda xavfsizlikni his qilishingiz uchun dasturda quyidagi imkoniyatlar
        mavjud
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-8 sm:gap-6 w-full max-w-6xl">
        {opportunities.map((opportunity, index) => (
          <div key={index} className="flex gap-6 md:gap-4 sm:flex-col sm:items-center sm:text-center">
            <img
              src={opportunity.icon || "/placeholder.svg"}
              alt={opportunity.title}
              className="w-[80px] h-[80px] md:w-[60px] md:h-[60px] sm:w-[50px] sm:h-[50px] flex-shrink-0 object-contain"
            />
            <div className="flex-1">
              <h3 className="text-[#1C1B50] font-bold text-xl md:text-lg sm:text-base mb-3 md:mb-2">
                {opportunity.title}
              </h3>
              <p className="text-[#53528A] font-medium text-base md:text-sm leading-relaxed">
                {opportunity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Opportunities
