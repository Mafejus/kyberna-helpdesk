import { Test, TestingModule } from '@nestjs/testing';
import { HelpdeskScheduleService } from './helpdesk-schedule.service';

describe('HelpdeskScheduleService', () => {
  let service: HelpdeskScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpdeskScheduleService],
    }).compile();

    service = module.get<HelpdeskScheduleService>(HelpdeskScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
