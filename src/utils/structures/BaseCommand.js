module.exports = class BasCommand {
  constructor(name, category, aliases) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
  }
};
