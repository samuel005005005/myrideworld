import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Rate limit solo en HTTP. En WebSocket no hay `res.header` y el guard
 * global de @nestjs/throttler rompe con TypeError.
 */
@Injectable()
export class HttpThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    return context.getType() === 'ws';
  }
}
