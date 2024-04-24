import { Test, TestingModule } from '@nestjs/testing';
import { GetsterProfileService } from './getster-profile.service';

describe('GetsterProfileService', () => {
  let service: GetsterProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetsterProfileService],
    }).compile();

    service = module.get<GetsterProfileService>(GetsterProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
