import { Button, Card } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface RoleCardProps {
  title: string;
  description: string;
  link?: string;
  icon: JSX.Element; // Customizable icon
}

const RoleCard = ({ title, description, link, icon }: RoleCardProps) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <Card
      className="flex flex-col items-center text-center justify-between p-6 rounded-lg shadow-lg transition hover:shadow-2xl hover:scale-105"
      style={{ width: "100%", height: "100%" }}
    >
      <div className="flex flex-col mb-3 subpixel-antialiased items-center gap-2">
        <div className="text-4xl text-main/50">{icon}</div>
        <h2 className=" text-main text-xl font-bold">{title}</h2>
        <p className="text-gray-600 subpixel-antialiased">{description}</p>
      </div>
      <Button onClick={handleClick}>{t('role.select')}</Button>
    </Card>
  );
};

export default RoleCard;
