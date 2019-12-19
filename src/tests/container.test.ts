import { injectable, inject, provide, ContainerBuilder, container } from '..';
import { Container } from '../lib/container';
import 'reflect-metadata';

interface IExampleService {
  get(): boolean;
}

@provide()
class ExampleService {
  public get(): boolean {
    return true;
  }
}

@provide('randomServ2')
class ExampleService2 {
  public get(): boolean {
    return true;
  }
}

class ExampleConsumer {
  @inject()
  exampleService: ExampleService;
}

class ExampleConsumer2 {
  @inject('randomServ2')
  exampleService: ExampleService2;
}

const cont = ContainerBuilder(container);

describe('Container', () => {

  beforeEach(() => {
    
  });

  describe('When using provider decorator', () => {
    test('It should have dependency ExampleService', () => {
      const okId = 'ExampleService';
      const badId = 'example';
      expect(() => container.get(okId)).not.toThrow();
      expect(() => container.get(badId)).toThrow();
    });
    test('Dependency should be injected', () => {
      const exampleConsumer = new ExampleConsumer();
      expect(() => exampleConsumer.exampleService).not.toBeInstanceOf(Error);
    })

    test('It should have dependency ExampleService2 with id randomServ2', () => {
      const okId = 'randomServ2';
      const badId = 'example';
      expect(() => container.get(okId)).not.toThrow();
      expect(() => container.get(badId)).toThrow();
    });
    test('Dependency with id randomServ2 should be injected', () => {
      const exampleConsumer = new ExampleConsumer2();
      expect(() => exampleConsumer.exampleService).not.toBeInstanceOf(Error);
    })
  });

  describe('When addTransient', () => {
    test('if has no id should create random id', () => {
      //container.addTransient<ExampleService>(ExampleService);

      const okId = 'ExampleService';
      const badId = 'example';

      expect(() => container.get<ExampleService>(okId)).not.toThrow();
      expect(() => container.get<ExampleService>(badId)).toThrow();
    });

    test('if has id should use the id', () => {
      const id = 'randomId1';
      container.addTransient<ExampleService>(ExampleService, id);

      const okId = id;
      const badId = 'ExampleService1';

      expect(() => container.get<ExampleService>(okId)).not.toThrow();
      expect(() => container.get<ExampleService>(badId)).toThrow();
    });
  });

  describe('When addSingleton', () => {
    test('if has no id should create random id', () => {
      //container.addSingleton<ExampleService>(ExampleService);

      const okId = 'ExampleService';
      const badId = 'example';

      expect(() => container.get<ExampleService>(okId)).not.toThrow();
      expect(() => container.get<ExampleService>(badId)).toThrow();
    });

    test('if has id should use the id', () => {
      const id = 'randomId2';
      container.addSingleton<ExampleService>(ExampleService, id);

      const okId = id;
      const badId = 'ExampleService2';

      expect(() => container.get<ExampleService>(okId)).not.toThrow();
      expect(() => container.get<ExampleService>(badId)).toThrow();
    });
  });

  describe('When addRequest', () => {
    test('if has no id should create random id', () => {
      //container.addRequest<ExampleService>(ExampleService);

      const okId = 'ExampleService';
      const badId = 'example';

      expect(() => container.get<ExampleService>(okId)).not.toThrow();
      expect(() => container.get<ExampleService>(badId)).toThrow();
    });

    test('if has id should use the id', () => {
      const id = 'randomId3';
      container.addRequest<ExampleService>(ExampleService, id);

      const okId = id;
      const badId = 'ExampleService3';

      expect(() => container.get<ExampleService>(okId)).not.toThrow();
      expect(() => container.get<ExampleService>(badId)).toThrow();
    });
  });
});
