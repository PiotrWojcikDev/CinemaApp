const assert = require('assert');
const sinon = require('sinon');
const { MovieController, upload } = require('../../controllers/movieController');
const Movie = require('../../models/Movie');
const Seance = require('../../models/Seance');
const CreateSuccess = require('../../utils/success');
const CreateError = require('../../utils/error');


const movieController = new MovieController();

describe('MovieController', () => {
  describe('addMovie', () => {
    it('should add a movie successfully', async () => {
      const req = {
        body: {
          title: 'Test Movie',
          yearOfProduction: 2022,
          director: 'Test Director',
          description: 'This is a test movie',
          movieGenre: 'Action',
        },
        file: {
          filename: 'test-image.jpg',
        },
      };
      const res = {};
      const next = sinon.spy();

      // Mocking Movie model's save method
      sinon.stub(Movie.prototype, 'save').resolves();

      await movieController.addMovie(req, res, next);

      assert(next.calledWith(CreateSuccess(201, 'Dodano film')));
      
      // Restore the stubbed method
      Movie.prototype.save.restore();
    });

    it('should handle missing file and call next with an error', async () => {
      const req = {
        body: {
          title: 'Test Movie',
          yearOfProduction: 2022,
          director: 'Test Director',
          description: 'This is a test movie',
          movieGenre: 'Action',
        },
      };
      const res = {};
      const next = sinon.spy();
    
      await movieController.addMovie(req, res, next);
    
      assert(next.calledOnce);
    
      const calledWithError = next.calledWithMatch({ status: 400, message: 'Nie załączono zdjęć!' });
    
      assert(calledWithError, `Expected next to be called with an error with status code 400 and message 'Nie załączono zdjęć!': ${JSON.stringify(next.getCall(0).args)}`);
    });
  });   
});
