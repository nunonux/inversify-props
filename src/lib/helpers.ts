import { inject as __inject, injectable as __injectable } from 'inversify';
import { provide as __provide } from 'inversify-binding-decorators';
import { cid, container } from '..';
import { InjectTypes } from './enums';
/**
 * @param key the name of the property,
 * If the interface is IMyService the key must be myService or _myService
 */
const keyToId = (key: string) => {
  if (!key) {
    throw new Error('A key is necessary to load this interface');
  }

  const prefix = key[0].toUpperCase();
  return prefix + key.slice(1).replace('_', '');
};

export let DependencyId: { [key: string]: string | symbol; } = {};

export function cacheId(customId: string | symbol, id: string): string | symbol {
  if (customId) {
    const typeofcu = typeof customId;
    const isNotSymbol = typeofcu === 'string';
    const result = isNotSymbol ? Symbol.for(customId.toString()) :customId;
    DependencyId[customId.toString()] = result;
    return result;
  }

  DependencyId[id] = DependencyId[id] || Symbol.for(id);
  return DependencyId[id];
}

/**
 * Decorator to inject dependencies in components or classes
 * @param id optional id, could be auto generated with prop name
 */
export function Inject(id?: string | symbol) {
  return (target: any, targetKey: string, index?: number) => {

    // Is parameter decorator
    if (typeof index === 'number') {
      const args = target.toString().match(/[constructor|function].*?\(([^)]*)\)/);

      if (!args) {
        throw new Error(`Cannot find constructor in this class ${target.name}`);
      }

      const listOfArgs = args[1].split(',').map(arg => (arg.replace(/\/\*.*\*\//, '').trim())).filter(x => x);
      const key = listOfArgs[index];
      const dependencyId = cacheId(id as string, injectId(key));

      return __inject(dependencyId)(target, targetKey, index);
    }

    // Is property decorator
    // Create id
    const generatedId = cacheId(id as string, injectId(targetKey));
    const realCid = typeof generatedId === 'symbol' || id ? generatedId : cid[generatedId];

    // For Components
    Reflect.deleteProperty(target, targetKey);
    Reflect.defineProperty(target, targetKey, {
      get() {
        return container.get(realCid);
      },
      set(value) {
        return value;
      }
    });

    // For Services
    return __inject(realCid)(target, targetKey);
  };
}

export const inject = Inject;

/**
 * Creates an identifier meanwhile we cannot create with interfaces
 * @param target the class to generate the name
 */
export function injectId(target: any): string {
  return keyToId(target.name || target);
}

/**
 * Help Injectable to cache id if necessary
 */
export function injectable(customId?: string) {
  return function (target: any) {
      cacheId(customId, injectId(target));
      return __injectable()(target);
  };
}

export function provide(customId?: string, injectType: InjectTypes = InjectTypes.Singleton, force: boolean = false) {
  return function (target: any) {
    const targetName = cacheId(customId, injectId(target));
    switch(injectType) {
      case InjectTypes.Singleton:
        return __provide(targetName, force)(target);
      case InjectTypes.Transient:
        return __provide(targetName, force)(target);
      default:
        return __provide(targetName, force)(target).inSingletonScope().done();
    }
  };
}



