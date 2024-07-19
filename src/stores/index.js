import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// pinia persist
const pinia = createPinia()

pinia.use(
  createPersistedState({
    key: (id) => `${import.meta.env.VITE_STROAGE_KEY}__${id}`,
    storage: localStorage,
    auto: true
  })
)

export default pinia
