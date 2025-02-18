import { Container } from './lib/container';
import { DependencyId, Inject, inject, injectable, provide } from './lib/helpers';
import { mockInject, mockRequest, mockSingleton, mockTransient, resetContainer } from './lib/mocks';
import { buildProviderModule } from 'inversify-binding-decorators';

// How to inject a dependency
// @Inject() nameService: INameService;

export const container: Container = new Container({defaultScope: 'Singleton'});
export const ContainerBuilder = (containerArgs: Container) => {
    containerArgs.load(buildProviderModule());
}

const cid = DependencyId;

export { Inject, inject, injectable, Container, mockInject, mockRequest, mockSingleton, mockTransient, resetContainer, cid, provide };

