import { Typography, message } from "antd";
import { BiCopy } from "react-icons/bi";

const { Text } = Typography;

interface CopyTextComponentProps {
  textToCopy: string | undefined;
}

const CopyTextComponent = ({ textToCopy }: CopyTextComponentProps) => {
  const handleCopy = () => {
    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          message.success("Copied to clipboard");
        })
        .catch((err) => {
          message.error("Failed to copy");
          console.error(err);
        });
    } else {
      message.warning("No ID available to copy");
    }
  };

  return (
    <Text
      onClick={handleCopy}
      type="secondary"
      className="flex cursor-pointer active:bg-gray-100 rounded p-1 items-center gap-1"
    >
      <BiCopy />
      {textToCopy}
    </Text>
  );
};

export default CopyTextComponent;
