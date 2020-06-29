const bcrypt = require('bcrypt');

module.exports = function (schema) {
  schema.pre('save', function (next) {
    const slugify = require('slugify');
    this.slug = slugify(this.title) + (bcrypt.hashSync((new Date()).getTime() + '', bcrypt.genSaltSync(8))).replace(/\$_|[^\w]/g, '').substr(0, 12);
    this.slug = this.slug.toLowerCase();
    this.created_at = new Date();
    next();
  })
};
