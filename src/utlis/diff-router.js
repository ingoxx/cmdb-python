export function showRouter(userRouter=[], allRouter = []) {
  let userRealRouter = [];
  allRouter.forEach((v, i) => {
    userRouter.forEach((item, index) => {
      if (item.name === v.meta.name) {
          v.hidden = true;
        if (item.children && item.children.length > 0) {
          showRouter(item.children, v.children)
        } else {
          v.children = []
          // v.hidden = true
        }
        userRealRouter.push(v)
      }
    })
  });
  return userRealRouter
}

