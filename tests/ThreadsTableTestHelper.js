/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'title',
    body = 'body',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING date',
      values: [id, title, body, owner],
    };

    const result = await pool.query(query);

    return result.rows[0].date;
  },
  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },
};
module.exports = ThreadsTableTestHelper;
