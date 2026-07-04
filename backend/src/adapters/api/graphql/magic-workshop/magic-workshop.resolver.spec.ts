import { MagicWorkshopResolver } from './magic-workshop.resolver';
import { MagicWorkshopService } from '@src/modules/magic-workshop/magic-workshop.service';
import {
  TaskStatus,
  QualityLevel,
  ItemType,
  type MagicItemCraftTaskModel as MagicItemCraftTaskSnapshot,
} from '@app-types/models/magic-workshop/magic-workshop.types';
import { CreateMagicItemCraftTaskInput } from './dto/create-magic-item-craft-task.input';

describe('MagicWorkshopResolver', () => {
  let resolver: MagicWorkshopResolver;
  let service: jest.Mocked<MagicWorkshopService>;

  const mockSnapshot: MagicItemCraftTaskSnapshot = {
    id: 'task-uuid-1',
    itemName: 'Flame Sword',
    itemType: ItemType.WEAPON,
    materialLevel: 3,
    status: TaskStatus.PENDING,
    qualityLevel: QualityLevel.RARE,
    resultDescription: 'A blazing sword',
    failureReason: undefined,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  const failedSnapshot: MagicItemCraftTaskSnapshot = {
    id: 'task-uuid-2',
    itemName: 'Broken Staff',
    itemType: ItemType.TOOL,
    materialLevel: 1,
    status: TaskStatus.FAILED,
    qualityLevel: undefined,
    resultDescription: undefined,
    failureReason: 'Material too brittle',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T01:00:00.000Z'),
  };

  beforeEach(() => {
    service = {
      createTask: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<MagicWorkshopService>;

    resolver = new MagicWorkshopResolver(service);
  });

  describe('createMagicItemCraftTask', () => {
    it('should delegate to service.createTask and return mapped model', async () => {
      service.createTask.mockResolvedValue(mockSnapshot);

      const input = new CreateMagicItemCraftTaskInput();
      input.itemName = 'Flame Sword';
      input.itemType = ItemType.WEAPON;
      input.materialLevel = 3;
      input.requestNote = 'Please make it sharp';

      const result = await resolver.createMagicItemCraftTask(input);

      expect(service.createTask).toHaveBeenCalledWith({
        itemName: 'Flame Sword',
        itemType: ItemType.WEAPON,
        materialLevel: 3,
        requestNote: 'Please make it sharp',
      });
      expect(result.id).toBe('task-uuid-1');
      expect(result.itemName).toBe('Flame Sword');
      expect(result.status).toBe(TaskStatus.PENDING);
      expect(result.qualityLevel).toBe(QualityLevel.RARE);
    });

    it('should propagate error when service.createTask fails', async () => {
      service.createTask.mockRejectedValue(new Error('materialLevel must be between 1 and 5'));

      const input = new CreateMagicItemCraftTaskInput();
      input.itemName = 'Invalid Item';
      input.itemType = ItemType.TOOL;
      input.materialLevel = 99;

      await expect(resolver.createMagicItemCraftTask(input)).rejects.toThrow(
        'materialLevel must be between 1 and 5',
      );
    });
  });

  describe('magicItemCraftTask', () => {
    it('should return mapped model with failed status and failureReason', async () => {
      service.findOne.mockResolvedValue(failedSnapshot);

      const result = await resolver.magicItemCraftTask('task-uuid-2');

      expect(result?.status).toBe(TaskStatus.FAILED);
      expect(result?.failureReason).toBe('Material too brittle');
      expect(result?.qualityLevel).toBeUndefined();
      expect(result?.resultDescription).toBeUndefined();
    });

    it('should return null when not found', async () => {
      service.findOne.mockResolvedValue(null);

      const result = await resolver.magicItemCraftTask('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
