import { Test, TestingModule } from '@nestjs/testing';
import { BlockedGetsterController } from './blocked-getster.controller';

describe('BlockedGetsterController', () => {
  let controller: BlockedGetsterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockedGetsterController],
    }).compile();

    controller = module.get<BlockedGetsterController>(BlockedGetsterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
