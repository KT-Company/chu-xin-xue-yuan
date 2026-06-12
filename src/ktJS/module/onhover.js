export default function onhover(evt) {
  const { objects } = evt
  if (objects.length > 0) {
    const { object } = objects[0]
    if (object.visible) {
      document.body.style.cursor = 'pointer'
      console.log(object, 'objectobjectobject')
    }
  }
}
