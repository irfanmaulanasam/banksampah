module.exports = {
    findBySlug: function (slug) {
      return this.findOne({
        slug
      })
    }
  };
