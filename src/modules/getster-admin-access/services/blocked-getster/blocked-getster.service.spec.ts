import { Test, TestingModule } from '@nestjs/testing';
import { BlockedGetsterService } from './blocked-getster.service';

describe('BlockedGetsterService', () => {
  let service: BlockedGetsterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockedGetsterService],
    }).compile();

    service = module.get<BlockedGetsterService>(BlockedGetsterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
