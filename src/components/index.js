const path = import.meta.glob('./**/*.vue', { eager: true, import: 'default' });
export default {
  install(app) {
    for (const key in path) {
      const com = path[key];
      app.component(com.__name, com);
    }
  },
};
