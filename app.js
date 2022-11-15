const express = require("express");
const app = express();
app.use(express.json());
const sqlite3 = require("sqlite3");
const path = require("path");
const { open } = require("sqlite");
let db = null;
const dbPath = path.join(__dirname, "moviesData.db");

const intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(`Data Base Error is ${error}`);
    process.exit(1);
  }
};
intializeDbAndServer();

//API 1
// List all the movie names from the movie table
//convert to object
const convertDbObjAPI1 = (objectItem) => {
  return {
    movieName: objectItem.movie_name,
  };
};

app.get("/movies/", async (request, response) => {
  const movieListQuery = `
    SELECT movie_name FROM movie;`;
  const getMovieListQueryResponse = await db.all(movieListQuery);
  response.send(
    getMovieListQueryResponse.map((eachMovie) => convertDbObjAPI1(eachMovie))
  );
});

// API 2
//Creates a new movie in the movie table. movie_id is auto-incremented

app.post("/movies/", async (request, response) => {
  const { movieName, directorId, leadActor } = request.body;

  const createMovieQuery = `insert into movie(director_id,movie_name,lead_actor) 
  values(${directorId},'${movieName}','${leadActor}');`;
  const createMovieQueryResponse = await db.run(createMovieQuery);
  response.send("Movie Successfully Added");
});

//API 3
//Returns a movie based on the movie ID
const convertDbObject = (objectItem) => {
  return {
    movieId: objectItem.movie_id,
    directorId: objectItem.director_id,
    movieName: objectItem.movie_name,
    leadActor: objectItem.lead_actor,
  };
};

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `select * from movie where movie_id = ${movieId};`;
  const getMovieQueryResponse = await db.get(getMovieQuery);
  response.send(convertDbObject(getMovieQueryResponse));
});

//API 4
//Updates the details of a movie in the movie table based on the movie ID3
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updateMovieQuery = `update movie set director_id = ${directorId}, movie_name = '${movieName}', lead_actor = '${leadActor}' where movie_id = ${movieId};`;
  const updateMovieQueryResponse = await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//API 5
//Deletes a movie from the movie table based on the movie ID
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `delete from movie where movie_id = ${movieId};`;
  const deleteMovieQueryResponse = await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//API 6
//Returns a list of all directors in the director table

const convertDirectorDbAPI6 = (objectItem) => {
  return {
    directorId: objectItem.director_id,
    directorName: objectItem.director_name,
  };
};

app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `select * from director;`;
  const getDirectorsQueryResponse = await database.all(getDirectorsQuery);
  response.send(
    getDirectorsQueryResponse.map((eachItem) => convertDirectorDbAPI6(eachItem))
  );
});

//API 7
//Returns a list of all movie names directed by a specific director

app.get("/directors/:directorId/movies/", async (request, responses) => {
  const { directorId } = request.params;
  const getMoviesByDirectory = ` select movie_name as movieName from movie where director_id = ${directorId};`;
  const getMoviesByDirectorQueryResponse = await db.all(getMoviesByDirectory);
  responses.send(getMoviesByDirectorQueryResponse);
});
module.exports = app;
