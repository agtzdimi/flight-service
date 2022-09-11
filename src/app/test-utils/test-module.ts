import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

export function getUnitTestingModule(testClass: any): Promise<TestingModule> {
  return Test.createTestingModule({ providers: [testClass] })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return createMock();
      }
    })
    .compile();
}
