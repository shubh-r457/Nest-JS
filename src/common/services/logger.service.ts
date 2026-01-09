import { Injectable, Scope } from '@nestjs/common';

/**
 * Custom Logger Service
 * Demonstrates creating custom providers for DI
 */

@Injectable({ scope: Scope.DEFAULT }) // Singleton scope (default)
export class LoggerService {
  private context = 'Application';

  log(message: string, context?: string) {
    const logContext = context || this.context;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [LOG] [${logContext}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    const logContext = context || this.context;
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] [${logContext}] ${message}`);
    if (trace) {
      console.error(`Stack Trace: ${trace}`);
    }
  }

  warn(message: string, context?: string) {
    const logContext = context || this.context;
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] [${logContext}] ${message}`);
  }

  debug(message: string, context?: string) {
    const logContext = context || this.context;
    const timestamp = new Date().toISOString();
    console.debug(`[${timestamp}] [DEBUG] [${logContext}] ${message}`);
  }

  setContext(context: string) {
    this.context = context;
  }
}
