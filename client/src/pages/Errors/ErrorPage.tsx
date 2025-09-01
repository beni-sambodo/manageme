import AddButton from "../../components/AddButton";
import Image from "../../assets/page-misc-error.png";
export default function ErrorPage() {
  return (
    <div className="bg-slate-50 h-screen font-sans w-screen flex flex-col justify-center items-center">
      <div className="text-h1/70 text-[34px] font-[600]">
        Internal server error 🔐
      </div>
      <div className="lowercase text-[16px] my-2 mb-4 text-p font-semibold  ">
        Oops somthing went wrong.
      </div>
      <img className="h-1/3 md:h-1/2" loading="lazy" src={Image} alt="errorpage" />
      <div className="mt-10">
        <AddButton text={"Back to Home"} link={"/"} />
      </div>
    </div>
  );
}
