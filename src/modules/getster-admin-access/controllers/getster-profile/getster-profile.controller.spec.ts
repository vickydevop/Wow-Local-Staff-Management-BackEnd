import { Test, TestingModule } from '@nestjs/testing';
import { GetsterProfileController } from './getster-profile.controller';

describe('GetsterProfileController', () => {
  let controller: GetsterProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetsterProfileController],
    }).compile();

    controller = module.get<GetsterProfileController>(GetsterProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
