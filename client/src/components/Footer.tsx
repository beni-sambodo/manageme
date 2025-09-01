import { useTranslation } from "react-i18next";
import { useState } from "react";
import SupportModal from "./Support";

export default function Footer() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <div className="flex pb-5 text-sm flex-col md:flex-row gap-y-2 md:gap-y-0 text-[#32475C]/60 mt-5 justify-between items-center">
      <SupportModal isVisible={isVisible} setIsVisible={setIsVisible} />
      <div>
        © 2024, {t("footer.made_by")}{" "}
        <a
          className="text-[#6464fd]"
          target="_blank"
          href="https://kydanza.me/"
        >
          Durbek Saydaliyev
        </a>{" "}
        <span className="ml-3 text-xs font-mono">v 1.2.0-beta</span>
      </div>
      <ul className="flex items-center duration-150 gap-2 ">
        <li className="cursor-pointer hover:text-main">{t("footer.documentation")}</li>
        <button
          onClick={() => setIsVisible(true)}
          className="cursor-pointer hover:text-main"
        >
          {t("footer.support")}
        </button>
      </ul>
    </div>
  );
}
