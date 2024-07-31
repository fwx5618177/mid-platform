import { Redirect } from 'umi';

const AuthWrapper = (props) => {
  // 检查本地存储中是否有 token
  const isAuth = localStorage.getItem('token');

  console.log('auth Wrapper isAuth:', isAuth, props);
  // 如果没有 token，则重定向到登录页面
  if (!isAuth) {
    console.log('auth Wrapper redirect to login');
    return <Redirect to="/user/login" />;
  }

  // 如果有 token，则渲染子组件
  return <>{props.children}</>;
};

export default AuthWrapper;
