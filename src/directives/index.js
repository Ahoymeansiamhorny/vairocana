import auth from './modules/auth'
import copy from './modules/copy'

const directivesList = {
  auth,
  copy
}

const directives = {
  install: function (app) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key])
    })
  }
}

export default directives
