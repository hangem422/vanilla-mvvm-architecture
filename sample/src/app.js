import Component from "./moudles/component.js";
import InputComp from "./components/input-comp.js";

class App extends Component {
  #container = document.createElement("div");
  #input;

  state = { text: "" };

  get $element() {
    return this.#container;
  }

  constructor() {
    super();
    this.#input = new InputComp();
    this.#container.className = "app";
    this.#container.appendChild(this.#input.$element);
  }

  #textChange(text) {
    this.setState({ text: text.toUpperCase() });
  }

  render() {
    const { text } = this.state;
    const onChange = this.#textChange.bind(this);

    this.#input.setProp({ value: text, onChange });
  }
}

export default App;
