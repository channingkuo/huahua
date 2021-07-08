<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <a-icon :type="props.menuInfo.icon" />
      <span>{{ props.menuInfo.title }}</span>
    </span>
    <template v-for="subMenu in props.menuInfo.children">
      <a-menu-item v-if="!subMenu.children || subMenu.children.length <= 0" :key="subMenu.key">
        <a-icon :type="subMenu.icon" />
        <span>{{ subMenu.title }}</span>
      </a-menu-item>
      <sub-menu v-else :key="subMenu.key" :menu-info="subMenu" />
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  props: ['menuInfo']
}
</script>
