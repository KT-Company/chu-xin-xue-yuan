/*
 * @Author: milong
 * @Date: 2026-06-25 09:50:29
 * @Description:
 */
function moveX(parentDom, moveDom, changeLight) {
  let innerWidth = window.innerWidth
  let appMainWidt = parseInt(document.getElementById('app-main').style.width)
  console.log(appMainWidt, innerWidth)

  //缩小因子
  let shrink = innerWidth / appMainWidt
  //放大因子
  let enlarge = appMainWidt / innerWidth

  let offsetLeft = parentDom.getBoundingClientRect().left
  console.log(offsetLeft)

  let moveState = false
  moveDom.addEventListener('mousedown', (e) => {
    moveState = true
  })
  moveDom.addEventListener('mouseup', (e) => {
    moveState = false
    parentDom.removeEventListener('mousemove', null)
  })
  parentDom.addEventListener('mousemove', (e) => {
    if (!moveState) return

    let moveX = (e.clientX - offsetLeft) * enlarge
    if (moveX < 0) {
      moveX = 0
    } else if (moveX > parentDom.clientWidth - moveDom.clientWidth) {
      moveX = parentDom.clientWidth - moveDom.clientWidth
    }
    changeLight(moveX / parentDom.clientWidth)
    moveDom.style.left = moveX + 'px'
  })
}
export { moveX }
