const nlp = require('compromise');
const packer = require('compromise-plugin');

// Corpus packages
const SocialMedia = require('./SocialMedia');

const corpuses = [
  SocialMedia,
];

corpuses.forEach((corpus) => {
  // Compress and add the corpus plugin
  nlp.plugin(packer(corpus));
});
