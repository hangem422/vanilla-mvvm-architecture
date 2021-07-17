import Component, { hasSomeProp } from "../moudles/component.js";

/**
 * @typedef {object} InputCompProp
 * @property {(value: string) => void} onChange input's onchange function
 * @property {string} value input's value
 */

class InputComp extends Component {
  #container = document.createElement("div");
  #input = document.createElement("input");

  /** @type {InputCompProp} */
  prop = {};

  get $element() {
    return this.#container;
  }

  constructor() {
    super();
    this.#container.className = "input-comp";
    this.#container.appendChild(this.#input);
  }

  componentDidMount() {
    this.#input.addEventListener("input", (e) => {
      this.prop.onChange(e.target.value);
    });
  }

  componentDidUpdate(_, preProp) {
    const onChange = hasSomeProp(preProp, "value");

    if (onChange) {
      const { value } = this.prop;
      const preValue = preProp.get("value");
      console.log(`Input value change ${value} from ${preValue}`);
    }
  }

  render() {
    this.#input.value = this.prop.value;
  }
}

export default InputComp;
