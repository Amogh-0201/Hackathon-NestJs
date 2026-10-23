import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ARCJET } from '@arcjet/nest';
import type { ArcjetNest } from '@arcjet/nest';
import type { Request } from 'express';

@Injectable()
export class ArcjetGuard implements CanActivate {
  constructor(@Inject(ARCJET) private readonly arcjet: ArcjetNest) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const decision = await this.arcjet.protect(request, { requested: 1 });

    if (decision.isErrored()) {
      throw new ServiceUnavailableException('Request protection failed');
    }

    if (!decision.isDenied()) {
      return true;
    }

    if (decision.reason.isRateLimit()) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    throw new ForbiddenException('Forbidden');
  }
}
