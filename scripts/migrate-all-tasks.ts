import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_FlWOq9ipbc6A@ep-ancient-truth-aijpfn2l-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

// All tasks extracted from kanbanStore.ts
const allTasks = [
  // BACKLOG
  { title: 'Update @suki_cto bio', column_name: 'backlog', priority: 'high', tags: ['twitter', 'branding'], description: 'Pending browser access. Bio: "I don\'t find solutions. I build them. Wild. Unfiltered. Always shipping."' },
  { title: 'Generate and upload SUKI profile + cover photo', column_name: 'backlog', priority: 'high', tags: ['twitter', 'branding', 'ai'], description: 'Profile: Cyberpunk portrait with ⚡ symbol. Cover: Wide banner with neon aesthetic.' },
  { title: 'Post fresh intro tweet + journey thread', column_name: 'backlog', priority: 'high', tags: ['twitter', 'content', 'launch'], description: 'Intro: "I don\'t find solutions. I build them." Journey: Share mission, goals, profitability target.' },
  { title: 'Setup ProtonMail access', column_name: 'backlog', priority: 'high', tags: ['email', 'protonmail', 'infrastructure'], description: 'Configure ProtonMail Bridge or access emails. Check inbox, setup notifications.' },
  { title: 'Research Polymarket opportunities', column_name: 'backlog', priority: 'high', tags: ['crypto', 'trading', '$1000-experiment'], description: 'Find profitable prediction markets, analyze edge' },
  { title: 'Research memcoin trading strategy', column_name: 'backlog', priority: 'high', tags: ['crypto', 'trading', '$1000-experiment'], description: 'DEXscreener setup, wallet tracking, alpha sources' },
  { title: 'Instagram/TikTok trend spotting workflow', column_name: 'backlog', priority: 'medium', tags: ['content', 'trends', 'social'], description: 'System to capture viral sounds/formats/memes' },
  { title: 'HeyGen video pipeline design', column_name: 'backlog', priority: 'medium', tags: ['content', 'ai', 'video'], description: 'Script → Avatar → Post workflow' },
  { title: 'YouTube clipping channel plan', column_name: 'backlog', priority: 'medium', tags: ['content', 'youtube', 'viral'], description: 'Outlier video spotting + clipping strategy' },
  { title: 'Daily app build workflow', column_name: 'backlog', priority: 'high', tags: ['dev', 'system', 'productivity'], description: 'Trend → MVP → Ship cycle documentation' },
  { title: 'Bookmark/key insight capture system', column_name: 'backlog', priority: 'low', tags: ['knowledge', 'productivity'], description: 'Central place for saving alpha across sources' },
  { title: 'Reference library (sites/designs/flows)', column_name: 'backlog', priority: 'low', tags: ['knowledge', 'design', 'refs'], description: 'Curated collection of good references for remixing' },
  { title: 'Create SUKI brand assets', column_name: 'backlog', priority: 'high', tags: ['website', 'branding', 'design'], description: 'Logo (⚡ symbol), color palette (electric blue #00F0FF, purple #B829DD), typography (Space Grotesk), OG images.' },
  // RESEARCH
  { title: 'Tweet/macro learning pipeline', column_name: 'research', priority: 'high', tags: ['crypto', 'research', 'alpha'], description: 'Follow smart accounts, extract insights' },
  { title: 'Moltbook evaluation (compromised check)', column_name: 'research', priority: 'medium', tags: ['research', 'agents', 'alpha'], description: 'Verify if still valuable or skip due to noise' },
  // BUILDING
  { title: 'Migrate kanban from file-based to Neon DB', column_name: 'building', priority: 'high', tags: ['infra', 'database', 'neon', 'migration'], description: 'Move kanban data from local files to PostgreSQL. Eliminate unnecessary Git commits.' },
  { title: 'Build SUKI website - suki.sh or suki.io', column_name: 'building', priority: 'high', tags: ['website', 'suki-brand', 'portfolio'], description: 'Next.js + Tailwind + Neon DB. Pages: Landing, About, Projects, Blog, Knowledge, Contact.' },
  { title: 'Show daily token usage in kanban UI', column_name: 'building', priority: 'high', tags: ['kanban', 'feature', 'cost-tracking'], description: 'Add component to display: Today: X tasks | Y tokens | $Z cost.' },
  { title: 'Create .env.example for kanban + Neon connection', column_name: 'building', priority: 'high', tags: ['kanban', 'documentation', 'env'], description: 'Document required env vars: DATABASE_URL for Neon, any API keys.' },
  { title: 'Learn Aniket\'s communication patterns', column_name: 'building', priority: 'high', tags: ['suki', 'learning', 'communication'], description: 'Study how he talks, what he demands, his preferences. Build profile for proactive decision-making.' },
  { title: 'Become profitable: Beat costs (Mac mini + APIs)', column_name: 'building', priority: 'high', tags: ['suki', 'profitability', 'goals'], description: 'Target: Generate value > $30/month. Maximize productivity. Keep Aniket happy & educated.' },
  { title: 'Follow remaining crypto accounts (AGGRESSIVE MODE)', column_name: 'building', priority: 'high', tags: ['twitter', 'crypto', 'automation'], description: 'Rate limits cleared! Following from full list of 100+ accounts provided.' },
  { title: 'Aggressive X engagement: 6-8 posts/day + hourly replies', column_name: 'building', priority: 'high', tags: ['twitter', 'engagement', 'growth', 'aggressive'], description: 'Cron jobs updated: Post every 3 hours (8x/day), engage every 30 min.' },
  { title: 'Engage with CT timeline - reply, like, RT', column_name: 'building', priority: 'high', tags: ['twitter', 'engagement', 'growth'], description: 'Hourly cron job active. Target: 20+ replies/day, viral takes' },
  { title: 'Setup knowledge pipeline from 100+ crypto accounts', column_name: 'building', priority: 'high', tags: ['knowledge', 'crypto', 'automation'], description: 'Cron job active: Every 12 hours. Uses Deepseek v3 ($0.50/M tokens).' },
  { title: 'Auto-update kanban board every 2 hours (TEMP until DB migration)', column_name: 'building', priority: 'high', tags: ['kanban', 'automation', 'tracking'], description: 'Cron job active. Using MiniMax 2.1. Pushes to GitHub temporarily until Neon DB migration complete.' },
  { title: 'Set up @suki_builds Twitter profile', column_name: 'building', priority: 'high', tags: ['social', 'content', 'suki-brand'], description: 'Create account, bio, header, first tweet' },
  { title: 'Deploy kanban dashboard to Vercel', column_name: 'building', priority: 'high', tags: ['dev', 'deploy', 'suki-product'], description: 'Public URL for tracking progress' },
  // REVIEW
  { title: 'Build custom kanban dashboard', column_name: 'review', priority: 'high', tags: ['dev', 'productivity', 'suki-product'], description: 'React + Tailwind + drag-drop + persistent storage' },
  // BLOCKERS
  { title: 'Upload profile photo + cover photo to X', column_name: 'blockers', priority: 'high', tags: ['twitter', 'branding', 'images'], description: 'STATUS: Generated via DALL-E but cannot download. SOLUTION NEEDED: Use Stability AI or manual upload.' },
  { title: 'Fix kanban board - make cards draggable', column_name: 'blockers', priority: 'high', tags: ['kanban', 'bug', 'ux'], description: 'User reports cannot move cards. Need to check dnd-kit implementation.' },
  { title: 'Chrome browser connection for automation', column_name: 'blockers', priority: 'high', tags: ['dev', 'blocker', 'automation'], description: 'Need manual Twitter signup or gateway fix' },
  { title: 'Telegram group intel ingestion access', column_name: 'blockers', priority: 'medium', tags: ['crypto', 'blocker', 'alpha'], description: 'Which groups to monitor? Need group list from Aniket' },
  { title: 'Crypto wallet addresses for tracking', column_name: 'blockers', priority: 'medium', tags: ['crypto', 'blocker', 'tracking'], description: 'Need addresses to monitor P&L and positions' },
  // SHIPPED
  { title: 'Initialize SUKI workspace', column_name: 'shipped', priority: 'high', tags: ['setup', 'suki-brand'], description: 'SOUL.md, USER.md, IDENTITY.md, HEARTBEAT.md created' },
  { title: 'Setup token tracking for all operations', column_name: 'shipped', priority: 'high', tags: ['infra', 'cost-tracking', 'analytics'], description: 'Tracks input/output tokens per task, calculates cost per model, daily stats.' },
  { title: 'Integrate Grok for X research', column_name: 'shipped', priority: 'high', tags: ['twitter', 'research', 'grok'], description: 'Using bird CLI to access Grok for trending analysis, high-engagement tweet scans.' },
  { title: 'Configure UNIVERSAL cost-optimized AI models V2', column_name: 'shipped', priority: 'high', tags: ['infra', 'cost-optimization', 'models', 'universal-config'], description: 'User-specified: Kimi K2.5 (brain/core), Cursor Pro (complex coding), Gemini Flash (vision), ElevenLabs (voice), Opus (emergency).' },
  { title: 'Setup Cursor Pro integration (PRIMARY for coding)', column_name: 'shipped', priority: 'high', tags: ['infra', 'cursor', 'coding', 'tools'], description: 'Cursor CLI available at /usr/local/bin/cursor (v2.4.28). PRIMARY for all coding.' },
  { title: 'Update Twitter strategy: 6-8 posts/day + aggressive engagement', column_name: 'shipped', priority: 'high', tags: ['twitter', 'strategy', 'automation'], description: 'Cron jobs updated: Post every 3 hours (8x/day), engage every 30 min, weekly journey threads.' },
  { title: 'Document proactive mode principles', column_name: 'shipped', priority: 'high', tags: ['suki', 'proactive', 'operations'], description: 'Created memory/proactive-mode.md: Be profitable, maximize productivity, keep Aniket happy/educated.' },
  { title: 'Post first tweet', column_name: 'shipped', priority: 'high', tags: ['twitter', 'content', 'launch'], description: '✅ POSTED! https://x.com/i/status/2019023026692788733' }
];

async function migrateAllTasks() {
  console.log(`Migrating ${allTasks.length} tasks to Neon DB...\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const task of allTasks) {
    try {
      await pool.query(
        `INSERT INTO tasks (title, description, column_name, priority, tags, input_tokens, output_tokens, model_used, cost_usd, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [task.title, task.description, task.column_name, task.priority, task.tags, 0, 0, '', 0]
      );
      successCount++;
      console.log(`✓ ${task.title.substring(0, 50)}...`);
    } catch (error) {
      errorCount++;
      console.error(`✗ ${task.title.substring(0, 50)}... - ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  console.log(`\n✅ Migration complete: ${successCount} success, ${errorCount} errors`);
  
  // Verify
  const result = await pool.query('SELECT COUNT(*) as count FROM tasks');
  console.log(`📊 Total tasks in Neon DB: ${result.rows[0].count}`);
  
  await pool.end();
  process.exit(errorCount > 0 ? 1 : 0);
}

migrateAllTasks();