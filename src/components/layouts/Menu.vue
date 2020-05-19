<script>
  import {routes} from '@/router'
  import Lists from 'nightnya-common-utils/Lists'
  import Strings from 'nightnya-common-utils/Strings'

  const Privates = {
    buildMenuItemList(data, activityRouteName, routeName, routePath) {
      if (Lists.isEmpty(routes)) return;
      const route = routes.find(r => r.name === activityRouteName);
      if (!route) return;
      data.path = route.path;
      data.menuItems = [];
      Privates.handleMenuItemList({
        menuItems: data.menuItems,
        routes: route.children,
        path: route.path,
        defaultOpenKeys: data.defaultOpenKeys,
        routeName, routePath
      });
    },
    handleMenuItemList({menuItems, routes, path, defaultOpenKeys = [], routeName, routePath}) {
      let existSelect = false;
      Lists.isNotEmpty(routes) && routes.forEach(r => {
        if (!existSelect) {
          if (Strings.isNotBlank(r.name)) {
            existSelect = r.name === routeName;
          } else {
            existSelect = r._path === routePath;
          }
        }
        const item = {...r};
        item._path = `${path || ''}/${r.path}`.replace(/\/+/g, '/');

        if (Lists.isNotEmpty(r.children)) {
          item.children = [];
          const subExistSelect = Privates.handleMenuItemList({
            menuItems: item.children,
            routes: r.children,
            path: item._path,
            defaultOpenKeys, routeName, routePath
          });
          if (subExistSelect) {
            if (!existSelect) {
              existSelect = true;
            }
            defaultOpenKeys.push(item.name || item._path)
          }

        }
        menuItems.push(item);
      });
      return existSelect;
    },
  };

  export default {
    name: "Menu",
    props: ['activityRouteName', 'theme', 'mode'],
    data() {
      const data = {
        path: null,
        menuItems: [],
        defaultSelectedKeys: [],
        defaultOpenKeys: []
      };
      data.defaultSelectedKeys = [this.$route.name || this.$route.path];
      Privates.buildMenuItemList(data, this.activityRouteName, this.$route.name, this.$route.path);
      return data;
    },
    methods: {
      handleMenuItemRender(h, routes = this.menuItems) {
        const menuItems = [];
        Lists.isNotEmpty(routes) && routes.forEach(r => {
          const meta = r.meta || {};
          if (meta._hiddenNav || meta._permissionDenied) return;
          if (Lists.isNotEmpty(r.children)) {
            menuItems.push(h('a-sub-menu', {
              key: r.name || r._path
            }, [
              h('span', {
                slot: 'title'
              }, [
                ...(meta['_icon'] ? [h('a-icon', {
                  props: {
                    type: meta['_icon']
                  }
                })] : []),
                h('span', r.title),
              ]),
              ...(this.handleMenuItemRender(h, r.children) || [])]))

          } else {
            menuItems.push(this.buildMenuItem(h, r))
          }
        });
        return menuItems;
      },
      buildMenuItem(h, route) {
        let key;
        let to;
        if (route.name) {
          key = route.name;
          to = {name: route.name}
        } else {
          key = route._path;
          to = {path: route._path}
        }
        const meta = route.meta || {};
        return h('a-menu-item', {
          key,
          on: {
            click: () => {
              this.$router.push(to)
            }
          }
        }, [
          ...(meta['_icon'] ? [h('a-icon', {
            props: {
              type: meta['_icon']
            }
          })] : []),
          h('span', route.title),
        ])
      }
    },
    render(h) {
      const menu = h('a-menu', {
        props: {
          defaultOpenKeys: this.defaultOpenKeys,
          defaultSelectedKeys: this.defaultSelectedKeys,
          theme: this.theme,
          mode: this.mode,
        },
      }, this.handleMenuItemRender(h) || []);
      return menu;
    }
  }
</script>

<style scoped>

</style>
