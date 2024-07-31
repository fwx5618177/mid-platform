import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    roles: ['admin'],
    permissions: ['dashboard.view', 'user.manage', 'quest.edit'],
  },
  {
    id: 2,
    username: 'editor',
    password: 'editor',
    roles: ['editor'],
    permissions: ['dashboard.view'],
  },
];

const getUserInfo = (token: string) => {
  const user = users.find((user) => user.id === parseInt(token, 10));
  if (user) {
    return {
      code: 200,
      msg: 'success',
      data: {
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      },
    };
  }
  return {
    code: 401,
    msg: 'Unauthorized',
  };
};

export default {
  'GET /api/currentUser': (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const userInfo = getUserInfo(token || '');
    if (userInfo.code === 401) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        success: true,
      });
      return;
    }
    res.send(userInfo);
  },
  'POST /api/login': async (req: Request, res: Response) => {
    const { username, password } = req.body;
    await waitTime(2000);
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
      res.send({
        code: 200,
        msg: 'success',
        data: {
          token: user.id.toString(),
        },
      });
      return;
    }
    res.status(401).send({
      code: 401,
      msg: 'Invalid credentials',
    });
  },
  'POST /api/login/outLogin': (req: Request, res: Response) => {
    res.send({ data: {}, success: true });
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Forbidden',
      message: 'Forbidden',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
