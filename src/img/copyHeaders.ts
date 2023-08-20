import { IncomingMessage, ServerResponse } from 'http';

function copyHeaders(origin: IncomingMessage, destination: ServerResponse): void {
  if (!origin.headers || typeof origin.headers !== 'object') {
    console.error('Headers inválidos ou ausentes na origem.');
    return;
  }

  const headers: [any, any][] = Object.entries(origin.headers);
  for (const [headerKey, headerValue] of headers) {
    destination.setHeader(headerKey, headerValue);
  }
}

export { copyHeaders };
