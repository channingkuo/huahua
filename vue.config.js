const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV !== 'production' ? '/' : '/vue-storyboard/',
  // publicPath: '../',

  productionSourceMap: process.env.NODE_ENV !== 'production',

  chainWebpack: config => {
    config.plugin('html')
      .tap(args => {
        args[0].title = 'Vue Storyboard'
        return args
      })

    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimize(true)

      // 移除 prefetch 插件，避免加载多余的资源
      config.plugins.delete('prefetch')
      // 移除 preload 插件，避免加载多余的资源
      config.plugins.delete('preload')

      const miniCssExtractPlugin = new MiniCssExtractPlugin({
        filename: 'assets/css/[name].[hash:8].css',
        chunkFilename: 'assets/css/[name].[hash:8].css'
      })
      config.plugin('extract-css').use(miniCssExtractPlugin)

      config.module.rule('images')
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true
        })
        .end()
        .use('url-loader')
        .loader('file-loader')
        .options({
          limit: 1000,
          name: 'assets/imgs/[name].[hash:8].[ext]'
        }).end()

      config.module.rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .use('file-loader')
        .loader('file-loader')
        .options({
          limit: 1000,
          name: 'assets/imgs/[name].[hash:8].[ext]'
        })
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.output.filename = 'assets/js/[name].[hash:8].js'
      config.output.chunkFilename = 'assets/js/[name].[hash:8].js'

      // 公共代码抽离
      config.optimization = {
        runtimeChunk: {
          name: 'manifest'
        },
        // 分割代码块
        splitChunks: {
          cacheGroups: {
            // 公用模块抽离
            common: {
              name: 'common',
              chunks: 'all',
              test: /\.(src)(\?.js)?$/,
              priority: 100,
              minSize: 0, // 大于0个字节
              minChunks: 1 // 抽离公共代码时，这个代码块最小被引用的次数
            },
            // 第三方库抽离
            vendor: {
              name: 'vendor',
              chunks: 'initial',
              priority: 1, // 权重
              test: /node_modules/,
              minSize: 0, // 大于0个字节
              minChunks: 2 // 在分割之前，这个代码块最小应该被引用的次数
            }
          }
        }
      }

      config.plugins.push(
        new CompressionWebpackPlugin(
          {
            filename: info => {
              return `${info.path}.gz${info.query}`
            },
            algorithm: 'gzip',
            threshold: 10240, // 只有大小大于该值的资源会被处理 10240
            test: new RegExp('\\.(' + ['js'].join('|') + ')$'),
            minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
            deleteOriginalAssets: false // 删除原文件
          }
        )
      )
    }
  },
  // 配置sass、less
  css: {
    extract: false,
    sourceMap: process.env.NODE_ENV !== 'production',
    loaderOptions: {
      sass: {
        prependData: '@import "@/style/index.scss";'
      },
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  }
}
