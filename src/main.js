main();
async function main() {
  console.log('test');
  process.stdout.write(JSON.stringify(process.env, null, 2) + '\n');
}
