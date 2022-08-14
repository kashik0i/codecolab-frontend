import sveltePreprocess from "svelte-preprocess";
import { optimizeImports, elements } from "carbon-preprocess-svelte";
export default {
  preprocess: [sveltePreprocess(), optimizeImports(), elements()],
};
