import apier from '../instances/GuguService'
import UserApi from './UserApi'

export default {
  UserApi: UserApi(apier),
}
