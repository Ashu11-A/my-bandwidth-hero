function copyHeaders(origin, destination) {
  if (!origin.headers || typeof origin.headers !== 'object') {
    console.error('Invalid or missing headers in the origin.');
    return;
  }

  for (const [key, value] of Object.entries(origin.headers)) {
    destination.setHeader(key, value);
  }
}

module.exports = { copyHeaders };
