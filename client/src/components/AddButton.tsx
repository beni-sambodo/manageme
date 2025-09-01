import { useNavigate } from "react-router-dom";

interface Props {
  width?: string;
  text: string;
  link: string;
}
export default function AddButton({ width, text, link }: Props) {
  const navigate = useNavigate();
  return (
    <button
      className={`bg-main hover:bg-main/80 transition duration-150 flex items-center justify-center ease-in-out active:scale-95 text-white rounded-lg h-[40px] shadow-lg px-3 ${width ? `w-${width}` : `w-fit`}`}
      onClick={() => navigate(link)}
    >
      {text}
    </button>
  );
}
