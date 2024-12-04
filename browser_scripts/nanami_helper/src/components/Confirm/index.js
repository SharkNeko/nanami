import { createApp } from "vue";
import Confirm from "./index.vue";

let instance;

const createInstance = () => {
  if (!instance) {
    const container = document.createElement("div");
    document.body.appendChild(container);
    instance = createApp(Confirm).mount(container);
  }
  return instance;
};

export const confirm = ({ title, content, target }) => {
  const confirmInstance = createInstance();
  return confirmInstance.open({ title, content, target });
};
