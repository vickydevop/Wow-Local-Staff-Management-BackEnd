import { Test, TestingModule } from '@nestjs/testing';
import { ExistingGetsterService } from './existing-getster.service';

describe('ExistingGetsterService', () => {
  let service: ExistingGetsterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExistingGetsterService],
    }).compile();

    service = module.get<ExistingGetsterService>(ExistingGetsterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
