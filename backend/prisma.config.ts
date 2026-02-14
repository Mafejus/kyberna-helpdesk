const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING;

if (!url) {
  console.error('❌ FATAL: DATABASE_URL is missing in prisma.config.ts process.env');
  console.error('Available keys:', Object.keys(process.env));
  throw new Error('DATABASE_URL is required in environment variables');
}

console.log('✅ Prisma Config loaded successfully with URL length:', url.length);

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: url,
  },
});
