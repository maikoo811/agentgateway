import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ユーザーを作成
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

  // APIキーを作成
  const apiKeys = await Promise.all([
    prisma.apiKey.upsert({
      where: { key: 'ag_7f8a9b2c_demo_key_1' },
      update: {},
      create: {
        name: 'Production API Key',
        key: 'ag_7f8a9b2c_demo_key_1',
        isActive: true,
        userId: user.id,
        lastUsedAt: new Date('2024-12-11T10:30:00Z'),
      },
    }),
    prisma.apiKey.upsert({
      where: { key: 'ag_3e4f5g6h_demo_key_2' },
      update: {},
      create: {
        name: 'Development API Key',
        key: 'ag_3e4f5g6h_demo_key_2',
        isActive: true,
        userId: user.id,
        lastUsedAt: new Date('2024-12-10T15:45:00Z'),
      },
    }),
    prisma.apiKey.upsert({
      where: { key: 'ag_1a2b3c4d_demo_key_3' },
      update: {},
      create: {
        name: 'Staging API Key',
        key: 'ag_1a2b3c4d_demo_key_3',
        isActive: false,
        userId: user.id,
        lastUsedAt: new Date('2024-12-05T08:15:00Z'),
      },
    }),
  ]);

  console.log('✅ Created API keys:', apiKeys.length);

  // リクエストログを作成（スキップ - 後のループで生成）

  // 過去30日分のサンプルデータを生成
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < 1000; i++) {
    const randomDate = new Date(
      thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
    );
    
    const models = ['gpt-4o', 'claude-3-5-sonnet-20241022', 'gpt-4o-mini', 'claude-3-5-haiku-20241022'];
    const endpoints = ['/v1/chat/completions', '/v1/messages'];
    const statuses = [200, 200, 200, 200, 200, 429, 500]; // 大部分は成功、一部エラー
    
    const model = models[Math.floor(Math.random() * models.length)];
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const inputTokens = Math.floor(Math.random() * 1000) + 100;
    const outputTokens = Math.floor(Math.random() * 1500) + 200;
    const responseTime = Math.floor(Math.random() * 2000) + 200;
    
    // コスト計算（簡易版）
    let cost = 0;
    if (status === 200) {
      if (model.includes('gpt-4o')) {
        cost = (inputTokens * 0.000005 + outputTokens * 0.000015);
      } else if (model.includes('claude')) {
        cost = (inputTokens * 0.000003 + outputTokens * 0.000015);
      }
    }
    
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    
    await prisma.request.create({
      data: {
        userId: user.id,
        apiKeyId: apiKey.id,
        method: 'POST',
        endpoint,
        model,
        status,
        responseTime,
        inputTokens,
        outputTokens,
        cost,
        userAgent: 'AgentGateway-SDK/1.0.0',
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        createdAt: randomDate,
      },
    });
  }

  console.log('✅ Created sample requests: 1000+ records');

  // 使用統計を作成
  await prisma.usageStats.createMany({
    data: [
      {
        userId: user.id,
        date: new Date('2024-12-11'),
        totalRequests: 4690,
        totalCost: 56.30,
        avgLatency: 856,
        successRate: 94.2,
      },
      {
        userId: user.id,
        date: new Date('2024-12-10'),
        totalRequests: 4234,
        totalCost: 51.20,
        avgLatency: 892,
        successRate: 92.1,
      },
      {
        userId: user.id,
        date: new Date('2024-12-09'),
        totalRequests: 3891,
        totalCost: 47.80,
        avgLatency: 934,
        successRate: 91.8,
      },
    ],
    skipDuplicates: true,
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


