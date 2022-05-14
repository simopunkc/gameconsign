require('dotenv').config();
const { env } = process;

function getOffset(page) {
  const itemPerPage = parseInt(env.PAGINATION_PER_PAGE);
  const offset = page > 1 ? page * itemPerPage - itemPerPage : 0;
  return {
    start: offset,
    limit: itemPerPage
  };
}

module.exports = {
  getOffset,
};
