import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import useFetchUser from "../hooks/useFetchUser";
import { App, Spin } from "antd";
import LoadingBar from "react-top-loading-bar";

export default function HomeLayout() {
  const { user, userLoading } = useFetchUser(); // Include userError for error handling
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // State to manage LoadingBar progress
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Redirect to login if user or token is missing and not loading
  useEffect(() => {
    if (!user && !token) {
      navigate("/login");
    }
  }, [user, token, userLoading, navigate]);

  // Handle LoadingBar progress
  useEffect(() => {
    if (userLoading) {
      setLoadingProgress(30);
    } else {
      setLoadingProgress(100);
    }
  }, [userLoading]);

  return (
    <App message={{ maxCount: 1 }}>
      <LoadingBar color="#696CFF" height={3} progress={loadingProgress} />
      <Header />
      <div className="flex relative justify-between items-start mx-3">
        {!userLoading && (
          <div
            className={`h-full sticky top-4 hidden md:block md:w-[10%] xl:w-[6.5%] ease-out 2xl:hover:w-[15%] xl:hover:w-[20%] mr-2.5 2xl:w-[4%] duration-300`}
          >
            <Sidebar />
          </div>
        )}

        <div className={`dark:bg-slate-800 w-full `}>
          <div className="min-h-[82vh]">
            {userLoading ? (
              <div className="w-full flex justify-center items-center min-h-[80vh]">
                <Spin size="large" />
              </div>
            ) : (
              <div>
                <Outlet />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-3">
        <Footer />
      </div>
    </App>
  );
}
