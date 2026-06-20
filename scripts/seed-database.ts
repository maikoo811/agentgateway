import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashApiKey(fullKey: string) {
  return crypto.createHash('sha256').update(fullKey).digest('hex');
}

const DEMO_API_KEYS = [
  {
    name: 'Production API Key',
    fullKey: 'ag_7f8a9b2c_demo_key_1',
    keyPrefix: 'ag_7f8a9b2c',
    isActive: true,
    lastUsedAt: new Date('2024-12-11T10:30:00Z'),
  },
  {
    name: 'Development API Key',
    fullKey: 'ag_3e4f5g6h_demo_key_2',
    keyPrefix: 'ag_3e4f5g6h',
    isActive: true,
    lastUsedAt: new Date('2024-12-10T15:45:00Z'),
  },
  {
    name: 'Staging API Key',
    fullKey: 'ag_1a2b3c4d_demo_key_3',
    keyPrefix: 'ag_1a2b3c4d',
    isActive: false,
    lastUsedAt: new Date('2024-12-05T08:15:00Z'),
  },
] as const;

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@agentgateway.com' },
    update: {},
    create: {
      email: 'demo@agentgateway.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('✅ Created user:', user.email);

  const apiKeys = await Promise.all(
    DEMO_API_KEYS.map((demoKey) =>
      prisma.apiKey.upsert({
        where: { key: hashApiKey(demoKey.fullKey) },
        update: {
          name: demoKey.name,
          keyPrefix: demoKey.keyPrefix,
          isActive: demoKey.isActive,
          lastUsedAt: demoKey.lastUsedAt,
        },
        create: {
          name: demoKey.name,
          key: hashApiKey(demoKey.fullKey),
          keyPrefix: demoKey.keyPrefix,
          isActive: demoKey.isActive,
          userId: user.id,
          lastUsedAt: demoKey.lastUsedAt,
        },
      })
    )
  );

  console.log('✅ Created API keys:', apiKeys.length);
  console.log('ℹ️  Demo API keys (development only):');
  for (const demoKey of DEMO_API_KEYS) {
    console.log(`   ${demoKey.name}: ${demoKey.fullKey}`);
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 1000; i++) {
    const randomDate = new Date(
      thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
    );

    const models = ['gpt-4o', 'claude-3-5-sonnet-20241022', 'gpt-4o-mini', 'claude-3-5-haiku-20241022'];
    const endpoints = ['/v1/chat/completions', '/v1/messages'];
    const statusCodes = [200, 200, 200, 200, 200, 429, 500];

    const model = models[Math.floor(Math.random() * models.length)];
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    const provider = endpoint === '/v1/messages' ? 'anthropic' : 'openai';

    const inputTokens = Math.floor(Math.random() * 1000) + 100;
    const outputTokens = Math.floor(Math.random() * 1500) + 200;
    const responseTime = Math.floor(Math.random() * 2000) + 200;

    let cost = 0;
    if (statusCode === 200) {
      if (model.includes('gpt-4o')) {
        cost = inputTokens * 0.000005 + outputTokens * 0.000015;
      } else if (model.includes('claude')) {
        cost = inputTokens * 0.000003 + outputTokens * 0.000015;
      }
    }

    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    await prisma.request.create({
      data: {
        userId: user.id,
        apiKeyId: apiKey.id,
        provider,
        method: 'POST',
        endpoint,
        model,
        statusCode,
        responseTime,
        tokensUsed: statusCode === 200 ? inputTokens + outputTokens : null,
        cost: statusCode === 200 ? cost : null,
        userAgent: 'AgentGateway-SDK/1.0.0',
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        createdAt: randomDate,
      },
    });
  }

  console.log('✅ Created sample requests: 1000+ records');

  await prisma.usageStats.createMany({
    data: [
      {
        userId: user.id,
        date: new Date('2024-12-11'),
        provider: 'openai',
        model: 'gpt-4o',
        requestCount: 2500,
        tokensUsed: 1200000,
        cost: 32.5,
        avgResponseTime: 820,
      },
      {
        userId: user.id,
        date: new Date('2024-12-11'),
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20241022',
        requestCount: 2190,
        tokensUsed: 980000,
        cost: 23.8,
        avgResponseTime: 892,
      },
      {
        userId: user.id,
        date: new Date('2024-12-10'),
        provider: 'openai',
        model: 'gpt-4o-mini',
        requestCount: 2100,
        tokensUsed: 640000,
        cost: 18.2,
        avgResponseTime: 760,
      },
    ],
  });

  console.log('✅ Created usage statistics');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
