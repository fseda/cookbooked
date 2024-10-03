import { createStore } from "./index.svelte"

export const createPageTitle = (initial?: string) => {
  return createStore(initial);
}
