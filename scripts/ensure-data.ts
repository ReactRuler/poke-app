import { ensurePokemonData } from './sync-pokemon-data';

ensurePokemonData().catch(error => {
  console.error('Error en sincronización:', error);
  process.exit(1);
});
