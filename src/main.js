main();
async function main() {
  console.log('wat');
  process.stdout.write(JSON.stringify(process.env, null, 2) + '\n');
}
