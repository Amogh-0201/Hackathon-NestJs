import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../lib/database/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const findMany = jest.fn();
  const findUnique = jest.fn();

  beforeEach(async () => {
    findMany.mockReset();
    findUnique.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: { user: { findMany, findUnique } },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('returns all users', async () => {
    const users = [{ id: 'user-1' }];
    findMany.mockResolvedValue(users);

    await expect(service.findAll()).resolves.toBe(users);
    expect(findMany).toHaveBeenCalledWith();
  });

  it('returns a user by ID', async () => {
    const user = { id: 'user-1' };
    findUnique.mockResolvedValue(user);

    await expect(service.findById('user-1')).resolves.toBe(user);
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'user-1' } });
  });

  it('throws NotFoundException when the user does not exist', async () => {
    findUnique.mockResolvedValue(null);

    await expect(service.findById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
