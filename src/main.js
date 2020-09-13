const fs = require('fs');

const events = require('./events');
const output = require('./output');

main().catch(error => {
  output.log(error);
  process.exit(127);
});

async function main() {
  output.debug('env:', process.env);

  const eventName = process.env.GITHUB_EVENT_NAME;
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  output.debug('event:', event);

  const [bumpType, pull] = await Promise.all([
    events.findComment(eventName, event),
    events.findPullRequestMetadata(eventName, event),
  ]);

  if (!bumpType) return;
  output.debug(`bump type:`, bumpType);

  const sha = await output.exec('git', 'rev-parse', 'HEAD');
  await output.exec('git', 'fetch', 'origin', pull.base, '--depth=1');
  await output.exec('git', 'checkout', pull.base);
  await output.exec('git', 'merge', sha, '--squash', '-m', `${pull.title} (#${pull.id})`);
}
