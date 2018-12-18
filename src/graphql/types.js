const { Card } = require("./types/card");
const { CardPatch } = require("./types/card-patch");
const { NewCardPatch } = require("./types/new-card-patch");
const { PaginationAmount } = require("./types/pagination-amount");
const { SocialLogin } = require("./types/social-login");
const { UserProfile } = require("./types/user-profile");

const types = [Card, CardPatch, NewCardPatch, UserProfile, PaginationAmount, SocialLogin];

module.exports = {
  types,
};
