import { Breadcrumb, Spin, message } from "antd";
import { Link } from "react-router-dom";
import useFetchUser from "../../hooks/useFetchUser";
import authService from "../../services/auth.service";
import { User } from "../../Types/Types";
import SettingForm from "./SettingForm";
import { useApiMutation } from "../../services/queryConfig";
import { useState } from "react";
import Email from "./Email";
import Transactions from "./Transactions";

const Profile = () => {
  const { user, userLoading, fetchData } = useFetchUser();
  const [avatarId, setAvatrId] = useState<string | undefined>(user?.avatar?._id);
  const updateUser = useApiMutation(
    (value: User) => authService.updateUser(value),
    {
      success: () => {
        message.success("Profile updated successfully"), fetchData();
      },
      error: () => message.error("Failed to update profile"),
      invalidateKeys: ["updateUser"],
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values:any) => {
    try {
     
      const formattedValues: User = {
        ...values,
        avatar: avatarId,
        username: values.username.toLowerCase(),
        phone: values.phone,
      };
      updateUser.mutate(formattedValues);
    } catch (err) {
      console.error("Error during form submission:", err);
      message.error("Failed to update user profile");
    }
  };

  if (userLoading) {
    return (
      <div className="w-full flex min-h-screen justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link to={"/"}>ManageMe</Link>,
          },
          {
            title: "Profile Settings",
          },
        ]}
      />
      <div className="md:flex-row flex-col flex mt-4 justify-between gap-5">
        <SettingForm
          onFinish={onFinish}
          user={user}
          isPending={updateUser.isPending}
          setAvatarId={setAvatrId}
        />
        <div className="flex flex-col gap-5 md:w-1/2">
          <Email user={user} fetchData={fetchData} />
          <Transactions/>
        </div>
      </div>
    </div>
  );
};

export default Profile;
