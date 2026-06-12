/**
 * 自定义 Web Components ,可用于三维弹窗，但是好像和自定义组件无缺编，先放在这儿，待大伙儿测试。
 */
import { defineCustomElement } from 'vue';

const modules = import.meta.glob('./*.ce.vue', {
  eager: true,
  import: 'default',
});

for (const path in modules) {
  const module = modules[path];
  const matchs = path.match(/\/(.*)\.ce\.vue$/);
  if (!matchs)
    continue;
  const name = `kt-cus-${(`${matchs[1]}`).toLowerCase()}`;

  const KtCusEl = defineCustomElement(module, {
    shadowRoot: false,
  });

  customElements.define(name, KtCusEl);
}
