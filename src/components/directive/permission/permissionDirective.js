import store from '../../../store'
import { isNull, isEmpty } from '../../../utils/index'
import Constant from '../../../utils/constant'

export default {

  inserted (el, binding, vnode) {
    const { value } = binding
    const privileges = store.getters && store.getters.privileges

    if (!isNull(value) && !isEmpty(value.moduleName) && !isEmpty(value.permission)) {
      let hasPermission = false

      if (!isNull(privileges) && privileges.length > 0) {
        const modulePermission = privileges.find(privilege => {
          return privilege.moduleName === value.moduleName
        })

        const targetPermission = Constant.privilegeOptions.find(option => {
          return option.alias === value.permission
        })

        if (modulePermission && targetPermission) {
          const modulePermissionValue = modulePermission.weight
          const targetPermissionValue = targetPermission.value

          if (modulePermissionValue & targetPermissionValue) {
            hasPermission = true
          }
        }
      }

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('使用方式: v-permission="{ moduleName: \'\', permission: \'edit\' }"')
    }
  }
}
