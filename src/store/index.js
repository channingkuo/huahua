import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // ./user-module.js => userModule
  const moduleName = modulePath
    .replace(/^\.\/(\w+)\s*-(\w+)\s*\.\w+$/, '$1-$2')
    .replace(/-\w+/, w => w.substring(1, 2).toUpperCase() + w.substring(2))
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const pluginsFiles = require.context('./plugins', true, /\.js$/)
const plugins = []
pluginsFiles.keys().reduce((plugin, pluginPath) => {
  const value = pluginsFiles(pluginPath)
  plugins.push(value.default)
}, {})

export default new Vuex.Store({
  modules,
  plugins
})
