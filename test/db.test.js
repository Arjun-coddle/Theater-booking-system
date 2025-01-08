const mysql = require('mysql2');
const dotenv = require('dotenv');
require('dotenv').config();

jest.mock('mysql2', () => ({
  createConnection: jest.fn(),
}));

describe('Database Connection', () => {
  let connectionMock;

  beforeEach(() => {
    connectionMock = {
      connect: jest.fn((callback) => callback(null)),
    };
    mysql.createConnection.mockReturnValue(connectionMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a connection with the correct configuration', () => {
    require('../config/db');
    expect(mysql.createConnection).toHaveBeenCalledWith({
      host: process.env.DB_HOST,
      port: process.env.PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
  });

  it('should connect to the database successfully', () => {
    console.log = jest.fn(); 

    require('../config/db');
    expect(connectionMock.connect).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Server Connected!');
  });

  it('should throw an error if the connection fails', () => {
    connectionMock.connect.mockImplementationOnce((callback) => {
      callback(new Error('Connection failed'));
    });

    expect(() => require('../config/db')).toThrow('Connection failed');
  });
});
