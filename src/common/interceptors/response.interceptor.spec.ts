import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom, of } from 'rxjs';
import { ResponseMessage } from '../decorators/response-message.decorator';
import { ResponseInterceptor } from './response.interceptor';

class TestController {
  @ResponseMessage('created')
  customMessage(this: void) {
    return 'payload';
  }

  defaultMessage(this: void) {
    return 'payload';
  }
}

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();
    interceptor = module.get(ResponseInterceptor);
  });

  afterEach(async () => {
    await module.close();
  });

  it('wraps responses with the status code and default message', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(
        createExecutionContext(TestController.prototype.defaultMessage),
        { handle: () => of('payload') },
      ),
    );

    expect(result).toEqual({
      statusCode: 201,
      message: 'success',
      data: 'payload',
    });
  });

  it('uses a custom message from the handler decorator', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(
        createExecutionContext(TestController.prototype.customMessage),
        { handle: () => of('payload') },
      ),
    );

    expect(result).toEqual({
      statusCode: 201,
      message: 'created',
      data: 'payload',
    });
  });
});

function createExecutionContext(handler: Function): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => TestController,
    switchToHttp: () => ({
      getResponse: () => ({ statusCode: 201 }),
    }),
  } as unknown as ExecutionContext;
}
