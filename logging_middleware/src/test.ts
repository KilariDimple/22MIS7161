import { Log } from './utils/logger';

async function main() {
  console.log('Testing logging middleware...\n');

  console.log('Test 1: Valid backend error log');
  const r1 = await Log('backend', 'error', 'handler', 'POST /vehicles/:id failed — vehicle ID 42 not found in DB');
  console.log('Result:', r1);

  console.log('\nTest 2: Valid backend info log');
  const r2 = await Log('backend', 'info', 'service', 'VehicleService.getAll — fetched 15 vehicles');
  console.log('Result:', r2);

  console.log('\nTest 3: Valid backend debug log');
  const r3 = await Log('backend', 'debug', 'db', 'Query executed: SELECT * FROM vehicles WHERE active=true');
  console.log('Result:', r3);

  console.log('\nTest 4: Invalid stack (should fail validation)');
  const r4 = await Log('invalid', 'info', 'handler', 'This should fail');
  console.log('Result:', r4);

  console.log('\nTest 5: Invalid package for backend (should fail validation)');
  const r5 = await Log('backend', 'info', 'component', 'Component is frontend only');
  console.log('Result:', r5);

  console.log('\nAll tests complete!');
}

main().catch(console.error);
