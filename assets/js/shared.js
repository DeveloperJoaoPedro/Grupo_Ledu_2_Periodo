import { updateBagCount } from "./core.js";
updateBagCount();
window.addEventListener("pageshow", updateBagCount);
window.addEventListener("storage", updateBagCount);
