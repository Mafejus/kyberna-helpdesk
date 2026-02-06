import { Test, TestingModule } from '@nestjs/testing';
import { HelpdeskScheduleController } from './helpdesk-schedule.controller';

describe('HelpdeskScheduleController', () => {
  let controller: HelpdeskScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpdeskScheduleController],
    }).compile();

    controller = module.get<HelpdeskScheduleController>(HelpdeskScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
