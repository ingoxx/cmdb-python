// 需要根据用户对应的权限动态的展示对应的菜单访问 addRouter()
const usersList = () => import('../views/users/Userlist');
const permsList = () => import('../views/perms/permList');
const rolesList = () => import('../views/perms/roleList');
const operationsList = () => import('../views/logs/operationList');
const webLogList = () => import('../views/logs/webLog');
const platformsList = () => import('../views/platforms/platformsList');
const updatePackage = () => import('../views/platforms/updatePackage');
const cronList = () => import('../views/crons/cronList');
const webList = () => import('../views/web/webList');
// const smbList = () => import('../views/smb/smb');
const assetsList = () => import('../views/assets/assetsList');
const deployList = () => import('../views/assets/deployList');
const sqlList = () => import('../views/runsql/sqlList');
const sqlIntranet = () => import('../views/runsql/sqlIntranet');
const layOut = () => import('../layout/Layout');

const dynamicRouter = [
  {
    path: 'users',
    name: 'users',
    redirect: 'list',
    component: layOut,
    meta: { name: '用户管理', icon: 'el-icon-s-custom' },
    children: [
      {
        path: '/users/list',
        name: 'users-list',
        component: usersList,
        meta: { title: ['用户管理', '用户列表'], name: '用户列表',  icon: 'el-icon-menu', keepAlive: true },
        hidden: false,
      }
    ]
  },
  {
    path: 'perms',
    name: 'perms',
    redirect: 'list',
    component: layOut,
    meta: { name: '权限管理', icon: 'el-icon-key' },
    children: [
      {
        path: '/perms/list',
        name: 'perms-list',
        component: permsList,
        meta: { title: ['权限管理', '权限列表'], name: '权限列表',  icon: 'el-icon-menu', keepAlive: false },
        hidden: false,
      },
      {
        path: '/perms/roles',
        name: 'roles-list',
        component: rolesList,
        meta: { title: ['权限管理', '角色列表'], name: '角色列表',  icon: 'el-icon-menu', keepAlive: true },
        hidden: false,
      }
    ]
  },
  {
    path: 'logs',
    name: 'logs',
    redirect: 'operate',
    component: layOut,
    meta: { name: '日志管理', icon: 'el-icon-edit-outline' },
    children: [
      {
        path: '/logs/operate',
        name: 'operate-list',
        component: operationsList,
        meta: { title: ['日志管理', '操作日志'], name: '操作日志',  icon: 'el-icon-menu', keepAlive: false },
        hidden: false,
      },
      {
        path: '/logs/web-log-list',
        name: 'web-log-list',
        component: webLogList,
        meta: { title: ['日志管理', 'web日志列表'], name: 'web日志列表',  icon: 'el-icon-menu', keepAlive: false },
        hidden: false,
      }
    ]
  },
  {
    path: 'platforms',
    name: 'platforms',
    redirect: 'list',
    component: layOut,
    meta: { name: '平台管理', icon: 'el-icon-platform-eleme' },
    children: [
      {
        path: '/platforms/list',
        name: 'platforms-list',
        component: platformsList,
        meta: { title: ['平台管理', '平台列表'], name: '平台列表',  icon: 'el-icon-menu', keepAlive: true },
        hidden: false,
      }
    ]
  },
  {
    path: 'crons',
    name: 'crons',
    redirect: 'list',
    component: layOut,
    meta: { name: '任务管理', icon: 'el-icon-s-order' },
    children: [
      {
        path: '/crons/list/',
        name: 'crons-list',
        component: cronList,
        meta: { title: ['任务管理', '任务列表'], name: '任务列表',  icon: 'el-icon-menu', keepAlive: true },
        hidden: false,
      }
    ]
  },
  {
    path: 'web',
    name: 'web',
    redirect: 'list',
    component: layOut,
    meta: { name: 'web管理', icon: 'el-icon-s-finance' },
    children: [
      {
        path: '/web/list/',
        name: 'web-list',
        component: webList,
        meta: { title: ['web管理', 'web列表'], name: 'web列表',  icon: 'el-icon-menu', keepAlive: true },
        hidden: false,
      }
    ]
  },
  {
    path: 'assets',
    name: 'assets',
    redirect: 'list',
    component: layOut,
    meta: { name: '机器管理', icon: 'el-icon-aim' },
    children: [
      {
        path: '/assets/list/',
        name: 'assets-list',
        component: assetsList,
        meta: { title: ['机器管理', '机器列表'], name: '机器列表',  icon: 'el-icon-menu', keepAlive: true },
        hidden: false,
      },
      {
        path: '/assets/deploy/list/',
        name: 'assets-deploy-list',
        component: deployList,
        meta: { title: ['机器管理', '部署列表'], name: '部署列表',  icon: 'el-icon-menu', keepAlive: true },
        hidden: false,
      },
    ]
  },
  {
    path: 'sql',
    name: 'sql',
    redirect: 'list',
    component: layOut,
    meta: { name: 'db管理', icon: 'el-icon-s-opportunity' },
    children: [
      {
        path: '/sql/list/',
        name: 'sql-list',
        component: sqlList,
        meta: { title: ['db管理', '外网db'], name: '外网db',  icon: 'el-icon-menu', keepAlive: true },
        hidden: false,
      },
      {
        path: '/sql/intranet-sql-items/',
        name: 'intranet-sql-items',
        component: sqlIntranet,
        meta: { title: ['db管理', '内网db'], name: '内网db',  icon: 'el-icon-menu', keepAlive: true },
        hidden: false,
      }
    ]
  },
  // {
  //   path: 'smb',
  //   name: 'smb',
  //   redirect: 'list',
  //   component: layOut,
  //   meta: { name: 'smb管理', icon: 'el-icon-s-finance' },
  //   children: [
  //     {
  //       path: '/smb/list/',
  //       name: 'smb-list',
  //       component: smbList,
  //       meta: { title: ['smb管理', 'smb列表'], name: 'smb列表',  icon: 'el-icon-menu', keepAlive: true },
  //       hidden: false,
  //     }
  //   ]
  // },
];

export default dynamicRouter
