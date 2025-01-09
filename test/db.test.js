const mysql = require('mysql2');
const connection = require('../config/db');

jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn((callback) => callback(null)),  
    query: jest.fn(),
  }),
}));

describe('DB Connection Tests', () => {

  test('should create a mysql connection', () => {
    expect(mysql.createConnection).toHaveBeenCalled();
  });

  test('should connect to the database successfully', () => {
    const mockConnect = mysql.createConnection().connect;
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  test('should handle query execution', () => {
    const mockQueryResult = { affectedRows: 1 };
    const mockQuery = mysql.createConnection().query;
    
    mockQuery.mockImplementationOnce((sql, params, callback) => {
      callback(null, mockQueryResult);  
    });

    connection.query('SELECT * FROM user WHERE id = ?', [1], (err, result) => {
      expect(result).toEqual(mockQueryResult);
    });

    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM user WHERE id = ?', [1], expect.any(Function));
  });

  test('should handle query error', () => {
    const mockQueryError = new Error('Database error');
    const mockQuery = mysql.createConnection().query;

    mockQuery.mockImplementationOnce((sql, params, callback) => {
      callback(mockQueryError, null);  
    });

    connection.query('SELECT * FROM user WHERE id = ?', [1], (err, result) => {
      expect(err).toEqual(mockQueryError);
      expect(result).toBeNull();
    });

    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM user WHERE id = ?', [1], expect.any(Function));
  });
});
