import { createRouter, createWebHashHistory } from 'vue-router';

const pages = import.meta.glob('../views/*/route.js', { eager: true, import: 'default' });
const viewComponent = import.meta.glob('../views/*/index.vue');

let routes = Object.entries(pages).map(([path, meta]) => {
  const viewComponentKey = path.replace('route.js', 'index.vue');
  path = path.replace('../views', '').replace('/route.js', '');
  const name = path.split('/').filter(Boolean).join('-');
  // 根据menuOrder排序
  return {
    path,
    name,
    component: viewComponent[viewComponentKey],
    meta,
  };
});

// 根据 meta 中的 menuOrder 对路由进行排序
routes = routes.sort((a, b) => {
  return (a.meta.menuOrder || 0) - (b.meta.menuOrder || 0);
});

// 首页重定向至第一个路由
routes.unshift({ path: '/', redirect: routes[0].path });

export default createRouter({
  routes,
  history: createWebHashHistory(),
});
