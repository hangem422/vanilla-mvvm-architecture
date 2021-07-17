# Vanilla MVVM Architecture

It is a process and result of considering the Component class that makes MVVM design patterns easier in vanilla JavaScript. I developed it inspired by React, so there are many similarities. Compilation using Babel is required for actual use.

## 1. How To Use

### 1.1 Create Component Class

Create by inheriting the `Component` class.

##### app.js

```javascript
class App extends Component {
  #container = document.createElement("div");

  state = { text: "" };

  get $element() {
    return this.#container;
  }

  constructor() {
    super();
    this.#container.className = "app";
  }
}
```

##### input-comp.js

```javascript
class InputComp extends Component {
  #container = document.createElement("div");
  #input = document.createElement("input");

  get $element() {
    return this.#container;
  }

  constructor() {
    super();
    this.#container.className = "input-comp";
    this.#container.appendChild(this.#input);
  }
}
```

## 2. Add Child Component

Create and add child components inside the `constructor` function.

##### app.js

```javascript
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
}
```

## 3. Render Component

It uses the `render` function by overriding it, and uses the `setProp` function of child components to deliver the properties. Child components run a chain of `render` function when changes are made to the properties.

##### app.js

```javascript
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

  render() {
    const { text } = this.state;
    this.#input.setProp({ value: text });
  }
}
```

##### input-comp.js

```javascript
class InputComp extends Component {
  #container = document.createElement("div");
  #input = document.createElement("input");

  get $element() {
    return this.#container;
  }

  constructor() {
    super();
    this.#container.className = "input-comp";
    this.#container.appendChild(this.#input);
  }

  render() {
    this.#input.value = this.prop.value;
  }
}
```

## 4. User Interface Connection

`setState` allows components to renew `state` and render applications.

##### app.js

```javascript
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
```

##### input-comp.js

```javascript
class InputComp extends Component {
  #container = document.createElement("div");
  #input = document.createElement("input");

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

  render() {
    this.#input.value = this.prop.value;
  }
}
```

## 5. Perform Logic After Update

To perform logic after updating, use `componentDidUpdate` by overriding it. As a parameter, you can receive the previous `state` and `prop`.

##### input-comp.js

```javascript
class InputComp extends Component {
  #container = document.createElement("div");
  #input = document.createElement("input");

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
```

## 2. Update History

- Viersion 1.1.0
  - `prestate` and `preprop` have only changed values.
  - `prestate` and `preprop` changed from Object to Map.
  - If there is `setState` currently pendding when `setProp` is running, suspend `render`.
  - Separte `componentDidMount` and `componentDidUpdate` from `conponentDidRender`.
