main();
async function main() {
  process.stdout.write(JSON.stringify(process.env, null, 2) + '\n');
}
