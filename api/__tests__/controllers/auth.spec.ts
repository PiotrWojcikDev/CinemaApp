
const CreateSuccess = require('../../utils/success');
const CreateError = require('../../utils/error');

const AuthController = require('../../controllers/authController');
const User = require('../../models/User');

jest.mock('../../models/User');

const authController = new AuthController();

const request = {
  body: {
    firstName: 'fake_firstname',
    lastName: 'fake_lastname',
    email: 'fake_email',
    phoneNumber: 'fake_phoneNumber',
    password: 'fake_password'
  }
};

const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

class DuplicateKeyError extends Error {
  code;

  constructor(message) {
      super(message);
      this.code = 11000;
      Object.setPrototypeOf(this, DuplicateKeyError.prototype);
  }
}
describe('AuthController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    const mockNext = jest.fn(); // Mock the 'next' function
    User.findOne.mockImplementationOnce(() => null);
    User.prototype.save.mockImplementationOnce(() => Promise.resolve());

    // Ustawienie odpowiedzi dla funkcji next
    mockNext.mockImplementationOnce(data => {
        // Sprawdzenie, czy odpowiedź zawiera oczekiwane dane
        expect(data).toEqual(CreateSuccess(200, 'Zarejestrowano!'));

    });

    await authController.register(request, response, mockNext);

    expect(mockNext).toHaveBeenLastCalledWith(CreateSuccess(200, 'Zarejestrowano!'));
  });

  it('should handle registration error when user already exists', async () => {
    const existingUser = {
        _id: 'someId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'wojcikpiotr00@gmail.com',
        password: 'hashedPassword',
    };

    const mockNext = jest.fn(); // Mock the 'next' function

    // Mockowanie funkcji save modelu User
    jest.spyOn(User.prototype, 'save').mockImplementationOnce(() => {
        throw new DuplicateKeyError('Duplicate key error');
    });

    // Symulacja istnienia użytkownika o podanym mailu
    jest.spyOn(User, 'findOne').mockReturnValue(existingUser);

    // Wywołanie funkcji register
    await authController.register(request, response, mockNext);

    // Oczekiwane wywołanie funkcji next z odpowiednimi danymi błędu
    expect(mockNext).toHaveBeenCalledWith(CreateError(400, 'Użytkownik o podanym mailu już istnieje!'));

  });

});
