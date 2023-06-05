const fs = require('fs');
const readlineSync = require('readline-sync');

const movieCatalogFile = 'movies.json';

// Read movie catalog from JSON file
function readMovieCatalog() {
  try {
    const catalogData = fs.readFileSync(movieCatalogFile, 'utf8');
    return JSON.parse(catalogData);
  } catch (err) {
    return [];
  }
}

// Write movie catalog to JSON file
function writeMovieCatalog(catalog) {
  fs.writeFileSync(movieCatalogFile, JSON.stringify(catalog, null, 2));
}

// Display movie catalog
function displayMovieCatalog() {
  const catalog = readMovieCatalog();
  if (catalog.length === 0) {
    console.log('The movie catalog is empty.');
  } else {
    console.log('Movie Catalog:');
    catalog.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.releaseYear}) - ${movie.director} (${movie.genre})`);
    });
  }
}

// Add new movie to catalog
function addNewMovie() {
  const title = readlineSync.question('Enter the movie title: ');
  const director = readlineSync.question('Enter the movie director: ');
  const releaseYear = readlineSync.question('Enter the release year: ');
  const genre = readlineSync.question('Enter the genre: ');

  const movie = {
    title,
    director,
    releaseYear,
    genre
  };

  const catalog = readMovieCatalog();
  catalog.push(movie);
  writeMovieCatalog(catalog);

  console.log('Movie added successfully.');
  showMainMenu();
}

// Update movie details
function updateMovieDetails() {
  displayMovieCatalog();
  const index = readlineSync.question('Enter the number of the movie to update: ');
  const catalog = readMovieCatalog();
  const movie = catalog[index - 1];

  const newTitle = readlineSync.question(`Enter the new title (current: ${movie.title}): `) || movie.title;
  const newDirector = readlineSync.question(`Enter the new director (current: ${movie.director}): `) || movie.director;
  const newReleaseYear = readlineSync.question(`Enter the new release year (current: ${movie.releaseYear}): `) || movie.releaseYear;
  const newGenre = readlineSync.question(`Enter the new genre (current: ${movie.genre}): `) || movie.genre;

  movie.title = newTitle;
  movie.director = newDirector;
  movie.releaseYear = newReleaseYear;
  movie.genre = newGenre;

  writeMovieCatalog(catalog);

  console.log('Movie details updated successfully.');
  showMainMenu();
}

// Delete movie from catalog
function deleteMovie() {
  displayMovieCatalog();
  const index = readlineSync.question('Enter the number of the movie to delete: ');
  const catalog = readMovieCatalog();
  if (index >= 1 && index <= catalog.length) {
    catalog.splice(index - 1, 1);
    writeMovieCatalog(catalog);
    console.log('Movie deleted successfully.');
  } else {
    console.log('Invalid movie index.');
  }
  showMainMenu();
}

// Search and filter movie catalog
//Search by year didnt work
function searchAndFilter() {
  const query = readlineSync.question('Enter the search query: ');
  const catalog = readMovieCatalog();
  const filteredMovies = catalog.filter(movie => {
    const { title, director, genre } = movie;
    return (
      title.toLowerCase().includes(query.toLowerCase()) ||
      director.toLowerCase().includes(query.toLowerCase()) ||
      genre.toLowerCase().includes(query.toLowerCase())
    );
  });

  if (filteredMovies.length === 0) {
    console.log('No matching movies found.');
  } else {
    console.log('Filtered Movie Catalog:');
    filteredMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.releaseYear}) - ${movie.director} (${movie.genre})`);
    });
  }

  showMainMenu();
}

// Main menu
function showMainMenu() {
  console.log('\nMovie Catalog CLI Application');
  console.log('-----------------------------');
  console.log('1. Display Movie Catalog');
  console.log('2. Add New Movie');
  console.log('3. Update Movie Details');
  console.log('4. Delete Movie');
  console.log('5. Search and Filter');
  console.log('0. Exit');

  const choice = readlineSync.question('\nEnter your choice: ');
  switch (choice) {
    case '1':
      displayMovieCatalog();
      showMainMenu();
      break;
    case '2':
      addNewMovie();
      break;
    case '3':
      updateMovieDetails();
      break;
    case '4':
      deleteMovie();
      break;
    case '5':
      searchAndFilter();
      break;
    case '0':
      return;
    default:
      console.log('Invalid choice. Please try again.');
      showMainMenu();
  }
}

// Start the application
showMainMenu();
