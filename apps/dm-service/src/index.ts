import { DMService } from './services/dm-service.js';

async function main(): Promise<void> {
  const service = new DMService();
  
  process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await service.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await service.stop();
    process.exit(0);
  });

  try {
    await service.initialize();
    await service.start();
  } catch (error) {
    console.error('Failed to start service:', error);
    process.exit(1);
  }
}

(async () => {
  await main();
})();