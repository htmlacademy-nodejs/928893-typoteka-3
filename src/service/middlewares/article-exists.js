'use strict';

const {HttpCode} = require('../../constants');

module.exports = (articleService) => (req, res, next) => {
  const {articleId} = req.params;
  const article = articleService.findOne(articleId);

  if (!article) {
    return res.status(HttpCode.NOT_FOUND).send(`not found ${articleId}`);
  }

  res.locals.article = article;
  return next();
};
