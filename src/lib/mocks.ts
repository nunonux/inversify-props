import { container } from "..";

/**
 * Decorator to inject dependencies for testing purposes
 * @param target: the component
 * @param key: the injected class
 * @param mock: the object mock
 * @example
 * mockInject(wrapper.vm, 'citiesService', {
 *   remove: x => x + 100000
 * })
 */
export function mockInject(target: any, key: any, mock: any) {
    console.log('this method is going to be deprecated soon, use mockDependency and check docs.');
  
    const getter = () => {
      return mock;
    };
  
    Reflect.deleteProperty[key];
    Reflect.defineProperty(target, key, {
      get: getter,
      set: x => x
    });
  }

/**
 * Unbind all dependencies from container
 */
export function resetContainer() {
    container.unbindAll();
}
  
  /**
   * After container is generated, mock an existing dependency as Singleton
   */
export function mockSingleton<T>(id: string | symbol, to: {new (...args: any[]): T;}) {
    container.unbind(id);
    container.addSingleton<T>(to, id);
}
  
  /**
   * After container is generated, mock an existing dependency as Transient
   */
export function mockTransient<T>(id: string | symbol, to: {new (...args: any[]): T;}) {
    container.unbind(id);
    container.addTransient<T>(to, id);
}
  
/**
 * After container is generated, mock an existing dependency as Request
 */
export function mockRequest<T>(id: string | symbol, to: {new (...args: any[]): T;}) {
    container.unbind(id);
    container.addRequest<T>(to, id);
}