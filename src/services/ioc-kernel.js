/**
 * Represents a IOC kernel used for dependency injection by
 * creating service bindings and resolving service instances.
 * @type {IocKernel}
 */
export class IocKernel {
  /**
   * Initializes a new IocKernel instance.
   * @return {IocKernel} The new IocKernel instance.
   */
  constructor() {
    this._bindings = {};
  }

  /**
   * Initializes a new service binding.
   * @param  {Class|string} keyExpression The name or class declaration of the service.
   * @return {BindingRoot} The root of the binding.
   */
  bind(keyExpression) {
    let key = this._getKey(keyExpression);
    if(typeof keyExpression === 'string') {
      return new BindingRoot(this, key);
    } else if(this._isClassDeclaration(keyExpression)) {
      return new ClassBindingRoot(this, key, keyExpression);
    }

    throw new Error('Argument "key" must be string or class declaration.');
  }

  /**
   * Checks, whether the kernel can resolve the service request or not.
   * @param  {Class|string} keyExpression The name or class declaration of the requested service.
   * @return {Boolean} A value determining whether the kernel can resolve the service request or not.
   */
  has(keyExpression) {
    return Object.prototype.hasOwnProperty.call(this._bindings, this._getKey(keyExpression));
  }

  /**
   * Gets the bound service for a specific key expression.
   * @param  {Class|string} keyExpression The name or class declaration of the requested service.
   * @return {Object} The requested service.
   */
  get(keyExpression) {
    let resolveFunction = this._bindings[this._getKey(keyExpression)];
    if(resolveFunction) {
      return resolveFunction();
    }
  }

  /**
   * Resolves a key expression to a key string.
   * @param  {Class|string} keyExpression The name or class declaration of a service.
   * @return {string} The resolved key.
   */
  _getKey(keyExpression) {
    if(typeof keyExpression === 'string') {
      return keyExpression;
    } else if(this._isClassDeclaration(keyExpression)) {
      return keyExpression.prototype.constructor.name;
    }
  }

  /**
   * Determines, whether the key expression is a class declaration or name of a service.
   * @param  {Class|string} keyExpression The name or class declaration of a service.
   * @return {Boolean} A value determining whether the key expression is a class declaration or name of a service.
   */
  _isClassDeclaration(keyExpression) {
    return keyExpression.prototype && keyExpression.prototype.constructor;
  }

  /**
   * Creates a new service binding.
   * @param  {string} key The key for the binding.
   * @param  {Function} resolveFunction The function used for resolving the service instance.
   * @return {void}
   */
  _createBinding(key, resolveFunction) {
    this._bindings[key] = resolveFunction;
  }
}

/**
 * Represents the root of a service binding.
 * @type {BindingRoot}
 */
class BindingRoot {
  /**
   * Initializes a new BindingRoot instance.
   * @param  {IocKernel} iocKernel The IOC kernel, on which the binding should be registered.
   * @param  {string} key The key of the binding.
   * @return {BindingRoot} The new BindingRoot instance.
   */
  constructor(iocKernel, key) {
    this._iocKernel = iocKernel;
    this._key = key;
  }

  /**
   * Binds the key to a function resolving the service instance.
   * @param  {Function} func The function, which resolves the service instance.
   * @return {BindingTarget} The target of the binding.
   */
  toFunction(func) {
    return new BindingTarget(this._iocKernel, this._key, func);
  }
}

/**
 * Represents the root of a service binding for binding class declarations.
 * @type {ClassBindingRoot}
 */
class ClassBindingRoot extends BindingRoot {
  /**
   * Initializes a new ClassBindingRoot instance.
   * @param  {IocKernel} iocKernel The IOC kernel, on which the binding should be registered.
   * @param  {string} key The key of the binding.
   * @param  {Class} classDeclaration The class declaration of the service.
   * @return {ClassBindingRoot} The new ClassBindingRoot instance.
   */
  constructor(iocKernel, key, classDeclaration) {
    super(iocKernel, key);
    this._classDeclaration = classDeclaration;
  }

  /**
   * Binds the class to another key instead of the class name.
   * @param  {string} key The new key.
   * @return {ClassBindingRoot} The root of the binding.
   */
  as(key) {
    return new ClassBindingRoot(this._iocKernel, key, this._classDeclaration);
  }

  /**
   * Binds the class declaration to itself.
   * @param  {...string|Function} args Arguments for the constructor of the service class, if needed. If argument is provided as function, it will be evaluated lazily when creating the service instance.s
   * @return {BindingTarget} The target of the binding.
   */
  toSelf(...args) {
    return new BindingTarget(this._iocKernel, this._key, () => {
      // Evaluate lazy arguments expressed as functions
      args = args.map(arg => typeof arg === 'function' ? arg() : arg);
      return new this._classDeclaration(...args);
    });
  }
}

/**
 * Represents the target of a binding.
 * @type {BindingTarget}
 */
class BindingTarget {
  /**
   * Initializes a new BindingTarget instance.
   * @param  {IocKernel} iocKernel The IOC kernel, on which the binding should be registered.
   * @param  {string} key The key of the binding.
   * @param  {Function} resolveFunction The function that resolves the service instance.
   * @return {BindingTarget} The new BindingTarget instance.
   */
  constructor(iocKernel, key, resolveFunction) {
    this._iocKernel = iocKernel;
    this._key = key;
    this._resolveFunction = resolveFunction;
  }

  /**
   * Registers the binding in transient scope, which means that a new
   * service instance is recreated every time it is requested.
   * @return {void}
   */
  inTransientScope() {
    this._iocKernel._createBinding(this._key, this._resolveFunction);
  }

  /**
   * Registers the binding in singleton scope, which means that the service
   * instance is created the first time it is requested and the very same
   * instance is returned on every subsequent request.
   * @return {void}
   */
  inSingletonScope() {
    let singleton;
    this._iocKernel._createBinding(this._key, () => {
      // Lazy singleton instantiation
      if(typeof singleton === 'undefined') {
        singleton = this._resolveFunction();
      }
      return singleton;
    });
  }
}
