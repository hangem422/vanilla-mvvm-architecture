const _pendding = new WeakMap();

class Component {
  #init = false;

  state = {};
  prop = {};

  constructor() {
    Promise.resolve().then(() => {
      if (this.#init) return;
      this.#init = true;
      this.preRender();
    });
  }

  /**
   * @description Change the state value.
   * @param {{ [key: string]: any }} state State values to change
   */
  setState(state) {
    const throttle = _pendding.has(this); // Check whether the previous `setState' function waiting to be reflected is executed.
    const nextState = throttle ? _pendding.get(this) : { ...this.state };
    let needRender = false;

    // Reflects the changes.
    Object.entries(state).forEach(([key, value]) => {
      if (nextState[key] !== undefined && nextState[key] !== value) {
        nextState[key] = value;
        if (!needRender) needRender = true;
      }
    });

    if (needRender && !throttle) {
      _pendding.set(this, nextState);

      Promise.resolve().then(() => {
        // Reflects the final state pending.
        const preState = this.state;
        this.state = _pendding.get(this);

        // Release the pendding and render the component.
        _pendding.delete(this);
        this.preRender(preState, this.prop);

        return { ...preState };
      });
    }
  }

  /**
   * @description Reflects the properties.
   * @param {{{ [key: string]: any }}} prop Properties to reflect
   */
  setProp(prop) {
    const nextProp = {};
    let needRender = false;

    Object.entries(prop).forEach(([key, value]) => {
      nextProp[key] = value;
      if (!needRender) needRender = this.prop[key] !== value;
    });

    if (needRender) {
      // If there is any change in the property, render the component.
      const preProp = this.prop;
      this.prop = nextProp;
      this.preRender(this.state, preProp);
    }
  }

  /**
   * @description Proceed before component rendering.
   * @param {{ [key: string]: any }} preState Previous State Value
   * @param {{ [key: string]: any }} preProp Previous Property
   */
  preRender(preState, preProp) {
    if (this.#init === false) this.#init = true;
    Promise.resolve().then(() => this.componentDidRender(preState, preProp));

    this.render();
  }

  /**
   * @description Render components.
   */
  render() {
    const proto = Object.getPrototypeOf(this);
    const name = proto?.constructor.name ?? 'Unknown';
    console.warn(`${name} component did not override the render function.`);
  }

  /**
   * @description Called when the entire render of the Application is terminated.
   * @param {{ [key: string]: any }} preState Previous State Value
   * @param {{ [key: string]: any }} preProp Previous Property
   */
  componentDidRender() {}
}

export default Component;
