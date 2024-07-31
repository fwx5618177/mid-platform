import { AvatarDropdown, AvatarName, Footer, Question, SelectLang } from '@/components';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { getUserInfo } from './services/ant-design-pro/login';
import access from './access';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const token = localStorage.getItem('token');
  
  const fetchUserInfo = async () => {
    try {
      if (token) {
        const userInfo = await getUserInfo();
        return userInfo.data;
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  };

  // 如果不是登录页面，执行
  const { location } = history;
  console.log('fetchUserInfo', location);
  if (location.pathname !== loginPath || token) {
    const currentUser = await fetchUserInfo();
    console.log('getInitialState', currentUser);
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      // src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;

      console.log('onPageChange', location.pathname, initialState?.currentUser);
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuDataRender: (menuData) => {
      const accessObj = access(initialState);
      return menuData.filter((item) => {
        if (item.access && !accessObj[item.access]) {
          return false;
        }
        return true;
      });
    },
    bgLayoutImgList: [
      {
        src: '/antd-default/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr.webp',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: '/antd-default/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr.webp',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: '/antd-default/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr.webp',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
