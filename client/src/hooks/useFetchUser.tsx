/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "../base/store";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useApiGet } from "../services/queryConfig";
import { message } from "antd";
import { User } from "../Types/Types";

const useFetchUser = () => {
  const { user, updateUser } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSuccess = (data: User) => {
    message.success("User data fetched successfully.");
    updateUser(data);
  };
  
  const onError = () => {
    message.error("Failed to fetch user data. Redirecting to login...");
    localStorage.clear();
    navigate("/login");
  };
  
  const { data, isLoading, refetch } = useApiGet<User, unknown>(
    ["fetchUser"],
    () => authService.getUser(),
    {
      onSuccess,
      onError,
    }
  );

  const clearUserCache = () => {
    // @ts-ignore
    queryClient.removeQueries(["fetchUser"]);
  };

  return {
    user: data ?? user,
    userLoading: isLoading,
    fetchData: refetch,
    clearUserCache,
  };
};

export default useFetchUser;
