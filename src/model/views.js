import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const charPokemons = mongoose.model('char-pokemons', new Schema({}));
const userFriends = mongoose.model('user-friends', new Schema({}));

export { charPokemons, userFriends };
