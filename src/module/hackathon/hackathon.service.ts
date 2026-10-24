import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../lib/database/prisma.service';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { UpdateHackathonDto } from './dto/update-hackathon.dto';

@Injectable()
export class HackathonService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.hackathon.findMany();
  }

  async findById(id: string) {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id },
    });

    if (!hackathon) {
      throw new NotFoundException(`Hackathon with ID ${id} not found`);
    }

    return hackathon;
  }

  create(dto: CreateHackathonDto, authorId: string) {
    const { name, description, startsAt, endAt, isActive } = dto;

    return this.prisma.hackathon.create({
      data: {
        id: randomUUID(),
        name,
        description,
        startDate: startsAt,
        endDate: endAt,
        isActive,
        authorId,
      },
    });
  }

  async update(id: string, dto: UpdateHackathonDto) {
    await this.findById(id);

    const { name, description, startsAt, endAt, isActive } = dto;

    return this.prisma.hackathon.update({
      where: { id },
      data: {
        name,
        description,
        startDate: startsAt,
        endDate: endAt,
        isActive,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    return this.prisma.hackathon.delete({
      where: { id },
    });
  }

  async join(id: string, userId: string) {
    const hackathon = await this.findById(id);

    if (!hackathon.isActive) {
      throw new BadRequestException('Hackathon is not active');
    }

    if (hackathon.endDate.getTime() <= Date.now()) {
      throw new BadRequestException('Hackathon has already ended');
    }

    const existingParticipant =
      await this.prisma.hackathonParticipant.findUnique({
        where: {
          hackathonId_userId: {
            hackathonId: id,
            userId,
          },
        },
      });

    if (existingParticipant) {
      throw new BadRequestException('Already joined this hackathon');
    }

    try {
      return await this.prisma.hackathonParticipant.create({
        data: {
          id: randomUUID(),
          hackathonId: id,
          userId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Already joined this hackathon');
      }

      throw error;
    }
  }
}
