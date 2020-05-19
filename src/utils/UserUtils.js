import config from "@/config";
import Strings from "nightnya-common-utils/Strings";
import GuguService from '@/api/GuguService'

const UserUtils = {
  user: {
    setUser(user) {
      UserUtils.localStorage.set(config.localStorageUserKey, user);
    },
    delUser() {
      return UserUtils.localStorage.del(config.localStorageUserKey);
    },
    getUser() {
      return UserUtils.localStorage.get(config.localStorageUserKey);
    },
    async login({account, password}) {
      const res = await GuguService.UserApi.login({account, password});
      console.log(2, res);
      this.setUser(res)
      return res;
    },
    async logout() {
      await GuguService.UserApi.logout();
      this.delUser();
    },
    async info() {
      const user = this.getUser();
      if (user) return user;
      // const res = await GuguService.UserApi.info();
      // if (!res) return null;
      // this.setUser(res)
      // return res;
    },
  },

  localStorage: {
    del(key) {
      localStorage.removeItem(key)
    },
    set(key, obj, expiresTime) {
      if (Strings.isNotBlank(expiresTime)) {
        obj.expiresDate = ((expiresTime || 0) * 1000) + new Date().getTime();
      }
      localStorage.setItem(key, encodeURIComponent(JSON.stringify(obj)));

    },
    get(key) {
      const str = localStorage.getItem(key);
      if (Strings.isBlank(str)) {
        return null;
      }
      try {
        const user = JSON.parse(decodeURIComponent(str));
        if (Strings.isNotBlank(user.expiresDate)) {
          if ((user.expiresDate || 0) < new Date().getTime()) {
            localStorage.removeItem(key);
            return null
          }
        }
        return user;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  }
};
export default {
  login: ({account, password}) => UserUtils.user.login({account, password}),
  logout: () => UserUtils.user.logout(),
  info: () => UserUtils.user.info(),
};
