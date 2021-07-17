const _pendding = new WeakMap();
const _penddingPreProp = new WeakMap();

class Component {
  #init = false;

  state = {};
  prop = {};

  constructor() {
    Promise.resolve().then(() => {
      if (this.#init) return;
      this.preRender();
    });
  }

  /**
   * @description Change the state value.
   * @param {{ [key: string]: any }} state State values to change
   */
  setState(state) {
    const debounce = _pendding.has(this); // Check whether the previous `setState' function waiting to be reflected is executed.
    const nextState = debounce ? _pendding.get(this) : { ...this.state };
    let needRender = false;

    // Reflects the changes.
    Object.entries(state).forEach(([key, value]) => {
      if (nextState[key] !== undefined && nextState[key] !== value) {
        nextState[key] = value;
        if (!needRender) needRender = true;
      }
    });

    if (needRender && !debounce) {
      _pendding.set(this, nextState);

      Promise.resolve().then(() => {
        // Reflects the final state pending.
        const preState = new Map();
        const preProp = _penddingPreProp.get(this);
        const nextState = _pendding.get(this);

        // Save the previous state.
        Object.keys(nextState).forEach((key) => {
          preState.set(key, this.state[key]);
        });

        // Release the pendding and render the component.
        if (preProp) _penddingPreProp.delete(this);
        _pendding.delete(this);

        this.state = nextState;
        this.preRender(preState, preProp || new Map());
      });
    }
  }

  /**
   * @description Reflects the properties.
   * @param {{{ [key: string]: any }}} prop Properties to reflect
   */
  setProp(prop) {
    const nextProp = {};
    const preProp = new Map();

    Object.entries(prop).forEach(([key, value]) => {
      if (this.prop[key] !== value) preProp.set(key, this.prop[key]);
      nextProp[key] = value;
    });

    if (preProp.size) {
      // If there is any change in the property, render the component.
      // If there is state render waiting, suspend prop render.
      this.prop = nextProp;

      if (_pendding.has(this)) _penddingPreProp.set(this, preProp);
      else this.preRender(new Map(), preProp);
    }
  }

  /**
   * @description Proceed before component rendering.
   * @param {Map<string, any>} preState Previous State Value
   * @param {Map<string, any>} preProp Previous Property
   */
  preRender(preState, preProp) {
    let afterRenderFunc = () => this.componentDidUpdate(preState, preProp);

    // If initialization is not in progress, run componentDidMount after render.
    if (this.#init === false) {
      afterRenderFunc = () => this.componentDidMount();
      this.#init = true;
    }

    Promise.resolve().then(afterRenderFunc);
    this.render();
  }

  /**
   * @description Render component.
   */
  render() {
    const proto = Object.getPrototypeOf(this);
    const name = proto?.constructor.name ?? "Unknown";
    console.warn(`${name} component did not override the render function.`);
  }

  /**
   * @description Called after component is first rendered.
   */
  componentDidMount() {}

  /**
   * @description Called after component update.
   * @param {Map<string, any>} preState Previous State Value
   * @param {Map<string, any>} preProp Previous Property
   */
  componentDidUpdate(preState, preProp) {}
}

/**
 * @description Validate that the Map has one of parma's properties.
 * @param {Map<string, any>} map validate target
 * @param  {...string} props porpertie names
 * @returns {boolean}
 */
export const hasSomeProp = (map, ...props) => {
  return props.some((prop) => map.has(prop));
};

export default Component;
