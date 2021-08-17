import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'
function AboutPage() {
  return (
    <div className="container">
      <div>
        <ul>
          <li>TMDB API<img style={{maxHeight: "13px", paddingLeft: "15px"}} src={`https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg`}/></li>
          <li>Cheerio</li>
          <li>Passport</li>
          <li>React</li>
          <li>Redux</li>
          <li>Node</li>
          <li>Express</li>
          <li>Postgres</li>
          <li>Axios</li>
          <li>Material-UI</li>
          <li>Saga</li>
          <li>Framegrabs for Ran from <a href="http://www.dvdbeaver.com/">DVDBeaver</a></li>
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
