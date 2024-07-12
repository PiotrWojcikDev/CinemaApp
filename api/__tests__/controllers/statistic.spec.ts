const request_ = require('supertest');
const jwt_ = require('jsonwebtoken');

const app_ = require('../../index'); // Importuje instancję aplikacji Express


const userData_ = {
    userId: 'exampleOwner',
    username: 'exampleOwner',
  };
  
const token_ = jwt_.sign(userData_, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

describe('StatisticController Integration Tests', () => {
  it('should return monthly reservations summary', async () => {
    const response = await request_(app_)
        .get('/api/statistics/monthlyReservationsSummary')
        .set('Authorization', `Bearer ${token_}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual(expect.stringContaining('Liczba rezerwacji w poszczególnych miesiącach'));
    expect(response.body.data).toBeDefined();
  });

  it('should return most viewed genres', async () => {
    const response = await request_(app_)
        .get('/api/statistics/mostViewedGenres')
        .set('Authorization', `Bearer ${token_}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual(expect.stringContaining('Gatunki i liczba rezerwacji'));
    expect(response.body.data).toBeDefined();
  });

  it('should return top 5 most viewed movies', async () => {
    const response = await request_(app_)
        .get('/api/statistics/mostViewedMovies')
        .set('Authorization', `Bearer ${token_}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual(expect.stringContaining('Top 5 filmów według gatunku'));
    expect(response.body.data).toBeDefined();
  });
});
