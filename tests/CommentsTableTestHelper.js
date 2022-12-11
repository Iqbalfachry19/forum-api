/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'some content',
    owner = 'user-123',
    thread_id = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING date',
      values: [id, content, thread_id, owner],
    };

    const result = await pool.query(query);
    return result.rows[0].date;
  },
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};
module.exports = CommentsTableTestHelper;
