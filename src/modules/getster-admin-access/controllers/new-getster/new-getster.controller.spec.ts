import { Test, TestingModule } from '@nestjs/testing';
import { NewGetsterController } from './new-getster.controller';

describe('NewGetsterController', () => {
  let controller: NewGetsterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewGetsterController],
    }).compile();

    controller = module.get<NewGetsterController>(NewGetsterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
