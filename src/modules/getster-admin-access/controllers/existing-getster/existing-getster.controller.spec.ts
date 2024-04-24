import { Test, TestingModule } from '@nestjs/testing';
import { ExistingGetsterController } from './existing-getster.controller';

describe('ExistingGetsterController', () => {
  let controller: ExistingGetsterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExistingGetsterController],
    }).compile();

    controller = module.get<ExistingGetsterController>(ExistingGetsterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
