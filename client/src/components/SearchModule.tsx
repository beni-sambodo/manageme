import { Button, Input, message } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import groupService from "../services/group.service";
import { IGRoup } from "../Types/Types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface SearchModuleProps {
  setSearch: Dispatch<SetStateAction<boolean>>;
}

export default function SearchModule({ setSearch }: SearchModuleProps) {
  const { t } = useTranslation();

  const handleInnerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [data, setData] = useState<IGRoup[]>([]);

  const handleGroupSearch = async () => {
    if (searchText) {
      try {
        setLoading(true);
        const res = await groupService.searchGroup(searchText);
        setData(res.data);
      } catch (error) {
        message.error("Search failed");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearch(false);
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [setSearch]);


  return (
    <div className="fixed inset-0 z-[99]">
      <div className="absolute inset-0 bg-[#32475C80] backdrop-blur-sm"></div>
      <div
        onClick={() => setSearch(false)}
        className="absolute grid place-items-center h-full w-full"
      >
        <div
          onClick={handleInnerClick}
          className="flex flex-col inset-0 w-[90%] md:w-3/6 aspect-square md:aspect-[2/1.5] rounded-xl p-5 bg-white"
        >
          <div className="text-p flex items-center justify-between">
            <span className="hidden md:block text-[22px] cursor-pointer">
              <FiSearch />
            </span>
            <Input
              className="h-10 bg-gray/10 rounded-lg md:w-1/2"
              variant="filled"
              placeholder="Search.."
              autoFocus
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(e.target.value)
              }
            />
            <button
              onClick={() => setSearch(false)}
              className="hidden md:block"
            >{`[esc]`}</button>
          </div>
          <div className="flex justify-center w-full">
            <ul className="mt-4 md:w-1/2 w-full flex h-full justify-between">
              <Button onClick={handleGroupSearch}>{t("search.groups")}</Button>
              <Button> {t("search.students")}</Button>
              <Button>{t("search.employees")}</Button>
            </ul>
          </div>
          <div className="mt-4">
            {loading ? (
              <>loading....</>
            ) : (
              data.map((i: IGRoup) => (
                <Link onClick={() => setSearch(false)} to={`/groups/${i._id}`} key={i._id}>
                  <div className="hover:bg-slate-100 rounded hover:pl-4 duration-200">
                    <b className="text-lg">{i.name}</b>
                    <p>
                      <span className="">Students: {i.students.length}/{i.space}</span>
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
