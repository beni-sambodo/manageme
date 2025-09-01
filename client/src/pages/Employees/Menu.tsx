import { useState } from 'react';
import { Tabs } from 'antd';

const Menu = ({ children, defaultActiveKey }:any) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  const handleTabChange = (key:any) => {
    setActiveKey(key);
  };

  return (
    <Tabs activeKey={activeKey} onChange={handleTabChange} className="mb-4">
      {children}
    </Tabs>
  );
};

export default Menu;
