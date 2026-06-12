export default function onclick(evt) {
  const { objects } = evt;
  if (objects.length > 0) {
    const { object } = objects[0];
    if (object.visible) {
      console.log('object: ', object);
    }
  }
}
