const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../../index'); // Importuje instancję aplikacji Express
const User = require('../../models/User');


const userData = {
  userId: 'exampleOwner',
  username: 'exampleOwner',
};

const token = jwt.sign(
  userData, 
  process.env.JWT_SECRET_KEY, 
  { expiresIn: '1h' }
);

describe('EmployeeController Integration Tests', () => {
  beforeEach(async () => {
    const salt = 10;
    const hashedPassword = await bcrypt.hash('testpassword', salt);
    const testEmployee = new User({
      firstName: 'Test',
      lastName: 'Employee',
      phoneNumber: '123456789',
      salary: 50000,
      email: 'test@example.com',
      password: hashedPassword,
      role: 'Employee',
    });
    await testEmployee.save();
  });

  afterEach(async () => {
    await User.findOneAndDelete({ email: 'test@example.com' });
  });
  
  it('should get all employees', async () => {
    const response = await request(app)
      .get('/api/employees/getAll')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('should update employee salary', async () => {
    const testEmployee = await User.findOne({ email: 'test@example.com' });
    const response = await request(app)
      .put(`/api/employees/${testEmployee._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        salary: 55000,
      });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual(
      expect.stringContaining(
        'Pomyślnie zmieniono pensje pracownika na: 55000'
        )
      );
  });

  it('should delete employee', async () => {
    const testEmployee = await User.findOne({ email: 'test@example.com' });

    const response = await request(app)
      .delete(`/api/employees/${testEmployee._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual(
      expect.stringContaining('Pomyślnie usunięto pracownika')
    );
  });
});
