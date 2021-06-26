# Vanilla MVVM Architecture

It is a process and result of considering the Component class that makes MVVM design patterns easier in vanilla JavaScript. I developed it inspired by React, so there are many similarities. Compilation using Babel is required for actual use.

## 1. Create Component Class

Create by inheriting the `Component` class.

```javascript
class App extends Component {
  #container = document.createElement("div");

  state = { text: "" };

  constructor() {
    super();
    this.#container.className = "application";
    document.body.appendChild(this.#container);
  }
}
```

```javascript
class InputComp extends Component {
  #container = document.createElement("div");
  #input = document.createElement("p");

  constructor() {
    super();
    this.#container.className = "input-container";
    this.#container.appendChild(this.#input);
  }

  get $element() {
    return this.#container;
  }
}
```

## 2. Add Child Component

Create and add child components inside the `constructor` function.

```javascript
class App extends Component {
  #container = document.createElement("div");
  #input;

  state = { text: "" };

  constructor() {
    super();
    this.#container.className = "application";
    document.body.appendChild(this.#container);
    
    this.#input = new InputComp();
    this.#container.appendChild(this.#input.$element);
  }
}
```

## 3. Render Component

It uses the `render` function by overriding it, and uses the `setProp` function of child components to deliver the properties. Child components run a chain of `render` function when changes are made to the properties.

```javascript
class App extends Component {
  #container = document.createElement("div");
  #input;

  state = { text: "" };

  constructor() {
    super();
    this.#container.className = "application";
    document.body.appendChild(this.#container);

    this.#input = new InputComp();
    this.#container.appendChild(this.#input.$element);
  }

  render() {
    const { text } = this.state;
    this.#input.setProp({ value: text });
  }
}
```

```javascript
class InputComp extends Component {
  #container = document.createElement("div");
  #input = document.createElement("p");

  constructor() {
    super();
    this.#container.className = "input-container";
    this.#container.appendChild(this.#input);
  }

  get $element() {
    return this.#container;
  }

  render() {
    this.#input.value = this.prop.value;
  }
}
```


## 4. User Interface Connection

`setState` allows components to renew `state` and render applications.

```javascript
class App extends Component {
  #container = document.createElement("div");
  #input;

  state = { text: "" };

  constructor() {
    super();
    this.#container.className = "application";
    document.body.appendChild(this.#container);

    this.#input = new InputComp();
    this.#container.appendChild(this.#input.$element);
  }

  #onChange(text) {
    this.setState({ text: text.toLowerCase() });
  }

  render() {
    const { text } = this.state;
    const onChange = this.#onChange.bind(this);

    this.#input.setProp({ value: text, onChange });
  }
}
```

```javascript
class InputComp extends Component {
  #container = document.createElement("div");
  #input = document.createElement("p");

  constructor() {
    super();
    this.#container.className = "input-container";
    this.#container.appendChild(this.#input);

    this.#input.addEventListener("input", (e) =>
      this.prop.onChange(e.target.value)
    );
  }

  get $element() {
    return this.#container;
  }

  render() {
    this.#input.value = this.prop.value;
  }
}
```

## 5. Perform Logic After Render

To perform logic after rendering, use `componentDidRender` by overriding it. As a parameter, you can receive the previous `state` and `prop`.

```javascript
class InputComp extends Component {
  #container = document.createElement("div");
  #input = document.createElement("p");

  constructor() {
    super();
    this.#container.className = "input-container";
    this.#container.appendChild(this.#input);

    this.#input.addEventListener("input", (e) =>
      this.prop.onChange(e.target.value)
    );
  }

  get $element() {
    return this.#container;
  }

  render() {
    this.#input.value = this.prop.value;
  }

  componentDidRender(_, preProp) {
    if (preProp.value !== this.prop.value) {
      console.log("Input value is changed");
    }
  }
}
```