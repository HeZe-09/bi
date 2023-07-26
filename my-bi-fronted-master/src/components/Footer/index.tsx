import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = 'hz学习';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'my智能 BI',
          title: 'my智能 BI',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          blankTarget: true,
        },
        {
          key: 'my智能 BI',
          title: 'my智能 BI',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
