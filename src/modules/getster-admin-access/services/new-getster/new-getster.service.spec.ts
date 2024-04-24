import { Test, TestingModule } from '@nestjs/testing';
import { NewGetsterService } from './new-getster.service';

describe('NewGetsterService', () => {
  let service: NewGetsterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewGetsterService],
    }).compile();

    service = module.get<NewGetsterService>(NewGetsterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
