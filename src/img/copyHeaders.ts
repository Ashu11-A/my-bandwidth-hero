import { IncomingMessage, ServerResponse } from 'http';

function copyHeaders(origin: IncomingMessage, destination: ServerResponse): void {
  if (!origin.headers || typeof origin.headers !== 'object') {
    console.error('Headers inválidos ou ausentes na origem.');
    return;
  }

  for (const [key, value] of Object.entries(origin.headers)) {
    const headerKey: string = key;
    const headerValue: any = value;
    destination.setHeader(headerKey, headerValue);
  }
}

export { copyHeaders };
