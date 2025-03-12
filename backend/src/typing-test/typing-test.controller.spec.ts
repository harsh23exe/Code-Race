import { Test, TestingModule } from '@nestjs/testing';
import { TypingTestController } from './typing-test.controller';

describe('TypingTestController', () => {
  let controller: TypingTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypingTestController],
    }).compile();

    controller = module.get<TypingTestController>(TypingTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
