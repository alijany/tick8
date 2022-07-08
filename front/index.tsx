import { Provider } from "react-redux";
import App from "./app";
import { store } from "./app.store";

import { createRoot } from 'react-dom/client';
const container = document.getElementById('app')!;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);