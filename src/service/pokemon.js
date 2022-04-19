import pokemon from '../model/pokemon';
import mongoose from 'mongoose';
import ServiceBase from './serviceBase';

// import pokedex from '../model/pokedex.json';

class PokemonService extends ServiceBase {
  async getPokemonInfo(id, info) {
    const pokemonDB = await pokemon.findById(id);
    // const pokemonDB = pokedex.find((pokemon) => pokemon.id === +id);

    console.log('pokemonDB', pokemonDB);

    return pokemonDB[info];
  }
}

export default new PokemonService();
