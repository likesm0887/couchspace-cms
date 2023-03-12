import { AlipayCircleOutlined, LockOutlined, MobileOutlined, TaobaoCircleOutlined, UserOutlined, WeiboCircleOutlined, } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText, ProConfigProvider, } from '@ant-design/pro-components';
import { message, Space, Tabs } from 'antd';
import { useState } from 'react';
import logo from '../../../../src/logo.png';
const iconStyles = {
    marginInlineStart: '16px',
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};
export default () => {
    const [loginType, setLoginType] = useState('account');
    return (<ProConfigProvider hashed={false}>
        <div style={{ backgroundColor: 'white' }}>
            <LoginForm submitter={{ searchConfig: { submitText: 'Login', }, }} logo={logo} title="Couchspace" subTitle="Couchspace管理平台" actions={<Space>

               
            </Space>}>
                <Tabs centered activeKey={loginType} onChange={(activeKey) => setLoginType(activeKey)}>
                    <Tabs.TabPane key={'account'} tab={'帳號密碼'} />

                </Tabs>
                {loginType === 'account' && (<>
                    <ProFormText name="username" fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                    }} placeholder={'帳號:'} rules={[
                        {
                            required: true,
                            message: '請輸入帳號!',
                        },
                    ]} />
                    <ProFormText.Password name="password" fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                    }} placeholder={'密碼:'} rules={[
                        {
                            required: true,
                            message: '請輸入密碼',
                        },
                    ]} />
                </>)}


            </LoginForm>
        </div>
    </ProConfigProvider>)
}