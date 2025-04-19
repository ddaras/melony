import { heading, root, vstack } from "melony";

function App() {
  return root()
    .appName("MentalConnect")
    .child(vstack().children([heading("MentalConnect")]))
    .shouldRenderHtml(true);
}

export default App;
