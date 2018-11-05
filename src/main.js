import Server from './server';
import routes from './config/routes';

function main() {
  const server = new Server(routes);
  server.start();
}

main();
