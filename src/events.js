const https = require('https');

const output = require('./output');

const COMMENT_FORMAT = /^\s*merge:\s+(major|minor|patch)\s*$/i;

module.exports.findComment = async function findComment(eventName, event) {
  if (eventName == 'issue_comment') {
    return parseIssueCommentEvent(event);
  }
}

module.exports.findPullRequestMetadata = async function findPullRequestMetadata(eventName, event) {
  if (eventName == 'issue_comment') {
    const pull = await readJsonUrl(event.issue.pull_request.url);
    output.debug(`pull request data:`, pull);

    return {
      id: event.issue.number,
      title: event.issue.title,
      base: pull.base.ref,
    };
  }
}

function parseIssueCommentEvent(event) {
  const { body } = event.comment;
  const match = COMMENT_FORMAT.exec(body);
  if (!match) {
    output.log(`no-op. Comment:`, body, `doesn't match the format:`, COMMENT_FORMAT);
    return;
  }

  return match[1];
}

function readJsonUrl(url) {
  output.debug('reading URL:', url);
  return new Promise((resolve, reject) => {
    const request = https.request(url, { headers: { 'User-Agent': 'Peyda-Automation (Merge-Bump)' }}, response => {
      response.on('error', reject);

      const chunks = [];
      response.on('data', c => chunks.push(c));
      response.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');

        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`Unable to read ${url}: ${response.statusCode} ${response.statusMessage}\n${body}`));
        } else {
          resolve(JSON.parse(body))
        }
      });

    });

    request.on('error', reject);
    request.end();
  });
}
