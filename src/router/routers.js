import UserUtils from "@/utils/UserUtils";

export default [
  {
    redirect: '/user/home',
  },
  {
    title: '后台',
    name: 'user',
    path: '/user',
    redirect: '/user/home',
    _: {
      layout: 'user',
      permissionDenied: {
        isRootRouter: false,
        _: {
          component: '@/components/sys/permissionDenied.vue'
        }
      },
      async loginVerify(
        // {to, from, isLoginRouter},
        {setPermission},
      ) {
        const user = await UserUtils.info();
        console.log(11,user)
        if (!user) return false;
        if (user.permissions) {
          setPermission(user.permissions)
        }
        return true;
      }
    },
    children: [
      {
        title: '首页',
        name: 'userHome',
        _: {
          path: 'home'
        },
        meta: {
          title: '用户首页',
        }
      },
      {
        title: '咕', name: 'gu', _: {path: 'gu',},
      },
      {
        title: '一定咕', name: 'ydg', _: {component: '@/views/user/ydggg.vue',},
      },
      {
        title: '咕咕咕',
        path: 'gugugu',
        children: [
          {
            title: '饲养场',
            name: 'gugugus',
            path: 'gu-list',
            children: [
              {
                title: '咕1号', name: 'gugugus1',
                _: {path: '1', permission: '1'},
                hiddenChildren: [
                  {title: '咕1号的水槽', name: 'gugugus1sc', _: {path: 'sc',}},
                  {title: '咕1号的饲料盆', name: 'gugugus1sl', _: {path: 'sl',}},
                ]
              },
              {
                title: '咕2号', name: 'gugugus2',
                _: {path: '2', permission: '2'},
                hiddenChildren: [
                  {title: '咕2号的水槽', name: 'gugugus2sc', _: {path: 'sc',}},
                  {title: '咕2号的饲料盆', name: 'gugugus2sl', _: {path: 'sl',}},
                ]
              },
              {
                title: '咕3号', name: 'gugugus3',
                _: {path: '3', permission: '3'},
                hiddenChildren: [
                  {title: '咕3号的水槽', name: 'gugugus3sc', _: {path: 'sc',}},
                  {title: '咕3号的饲料盆', name: 'gugugus3sl', _: {path: 'sl',}},
                ]
              },
            ]
          }
        ]
      }
    ]
  },

];
