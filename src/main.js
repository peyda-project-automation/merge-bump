const fs = require('fs');

main();
async function main() {
  process.stdout.write(`env:\n`);
  process.stdout.write(JSON.stringify(process.env, null, 2) + '\n');

  process.stdout.write(`event:\n`);
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  process.stdout.write(JSON.stringify(event, null, 2) + '\n');
}
