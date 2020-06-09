import Objs from 'nightnya-common-utils/Objs'
import String from 'nightnya-common-utils/Strings'
import Lists from 'nightnya-common-utils/Lists'

const Privates = {
  handlePermissionDenied(permissions, obj) {
    if (!Lists.includesAll(permissions, obj.meta._permissions)) {
      obj.meta._permissionDenied = true;
    }

    if (Lists.isNotEmpty(obj.children)) {
      obj.children.forEach((ro) => {
        Privates.handlePermissionDenied(permissions, ro);
      })
    }
  }
};

const defaultOptions = {
  pathLoadDir: './views/',
  layoutLoadDir: './layouts/',
};

const loadUtils = {
  require: (componentPath) => (resolve) =>
    require.ensure([], (require) => resolve(require.context('@', true, /\.vue$/)(`${componentPath.replace(/^@/, '.').replace(/\/+/g, '/')}`))),
  weeding(obj) {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      if (key.startsWith('_')) delete obj[key];
    }
  }
};

export default class RoutesHelper {
  
  constructor({layouts, routers, options = {}}) {
    this.config = Objs.merge({}, {
      layouts,
      routers,
      options: Objs.merge(Objs.merge({}, defaultOptions, true), options, true)
    })
  }

  buildLayouts() {
    if (!this.emptyLayout) {
      this.emptyLayout = {name: "EmptyLayout", render: h => h("router-view")}
    }
    if (!this.config || !this.config.layouts) {
      this.defaultLayout = null;
      this.layoutMap = {};
      return;
    }
    let layoutMap = {};
    for (let i = 0, len = this.config.layouts.length; i < len; i++) {
      const item = this.config.layouts[i];
      if (String.isBlank(item.name) || String.isBlank(item.path)) continue;
      if (item.default) this.defaultLayout = item.name;
      let path = `${this.config.options.layoutLoadDir}${item.path}.vue`;
      layoutMap[item.name] = {
        name: item.name,
        path,
        component: loadUtils.require(path)
      };
    }
    this.layoutMap = layoutMap;

  }

  buildRouters() {
    const helper = ({routers, path = '', titles = [], permissions = [], beforeEnter, rootRouterList}) => {
      const isTop = String.isBlank(path);
      const routerList = [];
      if (!rootRouterList) {
        rootRouterList = routerList;
      }
      routers.forEach(rr => {
        const r = {};
        Objs.merge(r, rr);
        const routerObj = {
          // _dev: {},
          meta: {}
        };

        routerObj.meta._titles = [...titles, (r.meta && r.meta.title) || r.title || ''];

        const _ = r._ || {};

        routerObj.meta._permissions = [...permissions];
        if (String.isNotBlank(_.permission)) {
          routerObj.meta._permissions.push(_.permission);
        }

        if (String.isNotBlank(_.path)) {
          routerObj.path = _.path.replace(/([A-Z])/g, (v) => '_' + v.toLowerCase());
        }

        if (String.isNotBlank(_.component)) {
          const componentPath = _.component;
          // routerObj._dev.componentPath = componentPath;
          routerObj.component = loadUtils.require(componentPath);
        } else {
          if (String.isNotBlank(_.path)) {
            const componentPath = `${this.config.options.pathLoadDir}${path}/${_.path}.vue`;
            // routerObj._dev.componentPath = componentPath;
            routerObj.component = loadUtils.require(componentPath);
          }
          if (isTop || r.children) {
            if (!_.layout && r.children && !isTop) {
              routerObj.component = this.emptyLayout;
              // routerObj._dev.layout = 'empty';
            } else if (_.layout !== false) {
              if (String.isNotBlank(_.layout) && this.layoutMap[_.layout]) {
                routerObj.component = this.layoutMap[_.layout].component;
                // routerObj._dev.layout = _.layout;
              }
              if (!routerObj.component && String.isNotBlank(this.defaultLayout)) {
                routerObj.component = this.layoutMap[this.defaultLayout].component;
                // routerObj._dev.layout = this.defaultLayout;
              }

            }
          }
        }

        for (const k in _) {
          if (!_.hasOwnProperty(k)) continue;
          if (k.startsWith('_')) routerObj.meta[k] = _[k];
        }

        routerObj.path = (routerObj.path || r.path || '/').replace(/\/+/g, '/');
        if (isTop && !routerObj.path.startsWith('/')) {
          routerObj.path = '/' + routerObj.path;
        }
        delete r.path;
        const childrenPath = routerObj.path === '/' ? (r.name || '/') : `${path}/${routerObj.path}`.replace(/\/+/g, '/');


        if (typeof _.loginVerify === "function") {
          let currentPermissions = [];
          const setPermission = (permissions) => {
            currentPermissions = permissions;
            Privates.handlePermissionDenied(currentPermissions, routerObj);
          };
          const lName = childrenPath.replace(/\//g, '_') + '_login_';
          const pdName = childrenPath.replace(/\//g, '_') + '_permissionDenied_';
          const nextObj = r.name ?
            {
              name: r.name
            } : {
              path: `${path}/${routerObj.path}`.replace(/\/+/g, '/')
            };
          const item = helper({
            rootRouterList,
            routers: [{
              title: '登录',
              name: lName,
              _: {
                path: 'login',
                _hiddenNav: true
              }
            }],
            path: childrenPath,
            titles: routerObj.meta._titles,
            permissions: routerObj.meta._permissions,
            beforeEnter: async (to, from, next) => {
              const res = await _.loginVerify({to, from, setPermission, isLoginRouter: true});
              if (res === false) {
                next();
              } else {
                next(nextObj);
              }
            }
          })[0];
          item.path = `${routerObj.path}/login`.replace(/\/+/g, '/');
          rootRouterList.push(item);


          let permissionDenied;
          let isRootRouter = false;
          if (typeof permissionDenied === "string") {
            permissionDenied = {
              _: {
                path: _.permissionDenied
              }
            }
          } else {
            permissionDenied = _.permissionDenied || {};
            isRootRouter = !!permissionDenied.isRootRouter;
            delete permissionDenied.isRootRouter;
            if (!permissionDenied._) permissionDenied._ = {};
          }
          if (!permissionDenied.component && !permissionDenied._.path && !permissionDenied._.component) {
            const that = this;
            permissionDenied.component = {
              render(h) {
                return h('div', {
                  style: {
                    'height': '100%',
                    'display': 'flex',
                    'justify-content': 'center',
                    'align-items': 'center'
                  },
                }, [h('h1', {}, ['无权访问 ', h('a', {
                  on: {
                    click: () => {
                      that.router.go(-1);
                    }
                  },
                }, '返回')])]);
              }
            }
          }

          // component
          const pdItem = helper({
            rootRouterList,
            routers: [Objs.merge({
              title: '无权访问',
              name: pdName,
              _: {
                _hiddenNav: true
              }
            }, permissionDenied)],
            path: childrenPath,
            titles: routerObj.meta._titles,
            permissions: routerObj.meta._permissions
          })[0];
          pdItem.path = `${routerObj.path}/permissiondenied`.replace(/\/+/g, '/');
          if (isRootRouter) {
            rootRouterList.push(pdItem);
          } else {
            if (!routerObj.children) routerObj.children = [];
            routerObj.children.push(pdItem);
          }


          beforeEnter = async (to, from, next) => {
            const res = await _.loginVerify({to, from, setPermission, isLoginRouter: false});
            if (res === false) {
              next({
                name: lName
              });
            } else {
              const toPermissions = Objs.getPathVal(to, 'meta._permissions');
              if (Lists.isEmpty(toPermissions)) {
                next();
                return;
              }


              if (!Lists.includesAll(currentPermissions, to.meta._permissions)) {
                next({
                  name: pdName
                });
                return;
              }

              next();
            }
          };
          routerObj.beforeEnter = beforeEnter;
        } else if (beforeEnter) {
          routerObj.beforeEnter = beforeEnter;
        }

        if (r.children) {
          const children = r.children;
          delete r.children;
          const subList = helper({
            rootRouterList,
            routers: children,
            path: childrenPath,
            titles: routerObj.meta._titles,
            permissions: routerObj.meta._permissions,
            beforeEnter
          });
          if (Lists.isNotEmpty(subList)) {
            if (!routerObj.children) routerObj.children = [];
            routerObj.children = [...routerObj.children, ...subList]
          }
        }
        if (r.hiddenChildren) {
          const hiddenChildren = r.hiddenChildren;
          delete r.hiddenChildren;

          const subList = helper({
            rootRouterList,
            routers: hiddenChildren,
            path: childrenPath,
            titles: routerObj.meta._titles,
            permissions: routerObj.meta._permissions,
            beforeEnter
          });
          if (Lists.isNotEmpty(subList)) {
            subList.forEach(item => {
              item.path = `${routerObj.path}/${item.path}`.replace(/\/+/g, '/');
              if (!item.meta) item.meta = {};
              item.meta._hiddenNav = true;
              routerList.push(item);
            });
            // routerObj.children = subList;
          }
        }

        loadUtils.weeding(r);
        Objs.merge(routerObj, r);

        routerList.push(routerObj);
      });
      return routerList;
    };

    this.routers = helper({
      routers: this.config.routers
    });
  }

  build() {
    this.buildLayouts();
    this.buildRouters();
    return this.routers;
  }

  bindEvents(router) {
    this.router = router;
    router.afterEach((to) => {
        let title = '';
        if (String.isNotBlank(to.meta.title)) {
          title = to.meta.title
        } else if (to.meta && Lists.isNotEmpty(to.meta._titles)) {
          for (let i = to.meta._titles.length - 1; i > 0; i--) {
            title += `<-${to.meta._titles[i]}`
          }
          title = title.replace(/<-/, '')
        }
        document.title = title;
      }
    );
  }
}
