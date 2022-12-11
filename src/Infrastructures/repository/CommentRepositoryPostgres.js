const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { content, threadId, owner } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3,$4) RETURNING id, content, owner',
      values: [id, content, threadId, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }
  async deleteComment(params) {
    const { commentId } = params;

    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }
  async checkCommentIsExist({ threadId, commentId }) {
    const query = {
      text: ` SELECT 1
      FROM comments INNER JOIN threads ON comments.thread_id = threads.id
      WHERE threads.id = $1
      AND comments.id = $2
      `,
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('comment tidak ada');
    }
  }

  async verifyCommentAccess({ ownerId, commentId }) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('akses ditolak');
    }
  }
  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT  comments.id,
      comments.content,
      comments.date, 
      users.username,
      comments.is_deleted
      FROM comments INNER JOIN users
      ON comments.owner = users.id
      WHERE comments.thread_id = $1
      ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
