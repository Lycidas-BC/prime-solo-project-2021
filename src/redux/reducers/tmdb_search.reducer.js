const emptySearchResultObject = {
  page: -1,
  results: [],
  total_pages: -1,
  total_results: -1
};
  
// emptySearchResultObject.results object examples:
// movie:
  // {
  //   adult: false,
  //   backdrop_path: '/rGgqwztE7v3jX3e7zWAIRy74vlH.jpg',
  //   genre_ids: [Array],
  //   id: 22855,
  //   original_language: 'en',
  //   original_title: 'Superman/Batman: Public Enemies',
  //   overview: 'United States President Lex Luthor uses the oncoming trajectory of a Kryptonite meteor to frame Superman and declare a $1 billion bounty on the heads of the Man of Steel and his ‘partner in crime’, Batman. Heroes and villains alike launch a relentless pursuit of Superman and Batman, who must unite—and recruit help—to try and stave off the action-packed onslaught, stop the meteor Luthors plot.',
  //   popularity: 38.414,
  //   poster_path: '/izvMc22ywSLFWUXZEIuJJ8dms75.jpg',
  //   release_date: '2009-09-29',
  //   title: 'Superman/Batman: Public Enemies',
  //   video: false,
  //   vote_average: 7,
  //   vote_count: 427
  // }
// tv:
  // {
  //   backdrop_path: '/s49fmJ0yopHa8GM6cyWObd4GkPk.jpg',
  //   first_air_date: '1976-09-11',
  //   genre_ids: [Array],
  //   id: 703,
  //   name: 'Tarzan, Lord of the Jungle',
  //   origin_country: [Array],
  //   original_language: 'en',
  //   original_name: 'Tarzan, Lord of the Jungle',
  //   overview: 'Tarzan, Lord of the Jungle is an animated series created by the Filmation studio for CBS. There are a total of 36 episodes produced over the first four seasons.\n' +
  //     '\n' +
  //     `The series does not appear in the Entertainment Rights library, and the rights most likely rest with the estate of Edgar Rice Burroughs. However, Warner Home Video has released one episode on DVD, "Tarzan and the Colossus of Zome," on Saturday Morning Cartoons: 1970s Volume 1; Warner Bros.' rights to the series may originate from their ownership of international TV distribution rights in the 1970s and 1980s.`,
  //   popularity: 4.429,
  //   poster_path: '/s8LWXoaqgbn6XmefiDYntJuapS.jpg',
  //   vote_average: 7,
  //   vote_count: 2
  // }
// person:
  // {
  //   adult: false,
  //   gender: 2,
  //   id: 287,
  //   known_for: [Array],
  //   known_for_department: 'Acting',
  //   name: 'Brad Pitt',
  //   popularity: 9.471,
  //   profile_path: '/oTB9vGIBacH5aQNS0pUM74QSWuf.jpg'
  // },
// keyword:
  //  name: 'batman most wanted'
  //  id: 264019 },

// Used to store api search results
const tmdbSearchReducer = (state = emptySearchResultObject, action) => {
  switch (action.type) {
    case 'SET_TMDB_SEARCH':
      console.log('in search tmdb reducer', action.payload);
      return action.payload;
    default:
      return state;
  }
}
  
export default tmdbSearchReducer;