import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { App, Spin } from "antd";
import LoadingBar from "react-top-loading-bar";
import useFetchUser from "../../hooks/useFetchUser";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function SelectLayout() {
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
      setLoadingProgress(30); // Start loading
    } else {
      setLoadingProgress(100); // End loading
    }
  }, [userLoading]); // Updated dependency array

  return (
    <App message={{ maxCount: 1 }}>
      <LoadingBar color="#696CFF" height={3} progress={loadingProgress} />
      <Header />
      <div className="flex mx-2">
        <div className={`dark:bg-slate-800 min-h-[80vh] w-full `}>
          {userLoading ? (
            <div className="w-full flex justify-center items-center min-h-[80vh]">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <Outlet />
              <Footer />
            </>
          )}
        </div>
      </div>
    </App>
  );
}
