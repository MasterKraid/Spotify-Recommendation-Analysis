const PROMOTED_SONG_PROBABILITY = 0.05;
const REGION_BIAS = 0.5;
const MAX_RECOMMENDATIONS = 20;
const CANDIDATE_SONGS = 80;
const regions = ['USA','EU','India','Japan','Brazil','Korea','UK','Canada','Australia','Germany','France'];
const genres = ['Pop','Rock','Hip-Hop','Electronic','Classical','Bollywood','K-Pop','Sertanejo','Trot','Jazz','Country'];
const artists = {
  USA: ['Travis Scott','Taylor Blue','The Weekday','Lone Star','Electric Dreams'],
  EU: ['Coldwave','EDM Masters','Euro Beats','Alan','Mystic Echoes'],
  India: ['A.R. Rahman','Lata Mangeshkar','Rahul Devgan','Shreya Ghoshal','Arijit Singh'],
  Japan: ['Yui Tanaka','Hiroshi Yamamoto','AKB48','Kenshi Yonezu','Utada Hikaru'],
  Brazil: ['Anitta Global','Sertanejo Kings','Bossa Nova Trio','Carlinhos Brown','Ivete Sangalo'],
  Korea: ['BTS Waves','Blackpink Style','Trot Masters','EXO Vision','Red Velvet'],
  UK: ['Adele Heart','Ed Sheeran Echo','Coldplay Nights','Dua Lipa Vibes'],
  Canada: ['Drake Flow','The Weeknd Beats','Celine Dion Diva','Justin Timberlake'],
  Australia: ['Sia Sound','Tame Impala Waves','Flume Rhythm'],
  Germany: ['Kraftwerk Pulse','Rammstein Beats','Zedd Electro'],
  France: ['Daft Punk Groove','Phoenix Rise','Air Vibes']
};
const adjectives = ['Midnight','Summer','Electric','Dream','Cold','Dragon','Cat','Golden','Mystic','Crimson','Neon'];
const nouns = ['Vibes','Nights','Waves','Soul','Life','Days','Rhythms','Echoes','Horizons','Beats','Melody'];
let user = {username:'', region:'', genreCount:{}, playHistory:[]};
let currentPlaylist = [];
let currentSong = null;
let currentSongIndex = -1;
let isPlaying = false;
let currentTimer = null;
let currentSeconds = 0;
const authContainer = document.getElementById('auth-container');
const mainContainer = document.getElementById('main-container');
const recommendationsContainer = document.getElementById('recommendations');
const nowPlaying = document.getElementById('now-playing');
const currentSongDisplay = document.getElementById('current-song');
const songTimer = document.getElementById('song-timer');
const playPauseBtn = document.getElementById('play-pause-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
document.getElementById('auth-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const region = document.getElementById('region').value;
  if(username && regions.includes(region)) {
    user.username = username;
    user.region = region;
    document.getElementById('display-username').textContent = username;
    authContainer.style.display = 'none';
    mainContainer.style.display = 'block';
    document.querySelector('.header').style.display = 'flex';
    generateRecommendations();
  }
});
themeToggleBtn.addEventListener('click', function() {
  document.body.classList.toggle('light-theme');
});
function generateSong() {
  const isPromoted = Math.random() < PROMOTED_SONG_PROBABILITY;
  const region = isPromoted ? user.region : (Math.random() < REGION_BIAS ? user.region : regions[Math.floor(Math.random()*regions.length)]);
  const title = `${adjectives[Math.floor(Math.random()*adjectives.length)]} ${nouns[Math.floor(Math.random()*nouns.length)]}`;
  return {title, artist: artists[region][Math.floor(Math.random()*artists[region].length)], region, genre: genres[Math.floor(Math.random()*genres.length)], duration: Math.floor(Math.random()*240+60), promoted: isPromoted, plays:0};
}
function createSongCard(song, index) {
  const card = document.createElement('div');
  card.className = `song-card ${song.promoted ? 'promoted' : ''}`;
  card.innerHTML = `<div class="play-indicator">▶</div><div class="song-content"><h3>${song.title}</h3><div class="artist">${song.artist}</div><div class="tags"><div class="tag">${song.genre}</div><div class="tag">${song.region}</div>${song.promoted ? '<div class="tag" style="background:#1DB954">Promoted</div>' : ''}</div></div>`;
  card.onclick = () => { user.playHistory.push(song); playSong(song, index); };
  return card;
}
function generateRecommendations() {
  recommendationsContainer.style.opacity = 0;
  setTimeout(() => {
    let recommendations = [];
    for(let i = 0; i < CANDIDATE_SONGS; i++){
      recommendations.push(generateSong());
    }
    const genreCount = user.playHistory.reduce((acc, song) => {
      acc[song.genre] = (acc[song.genre] || 0) + 1;
      return acc;
    }, {});
    const scored = recommendations.map(song => {
      let score = 0;
      if(user.playHistory.length === 0) {
        if(song.region === user.region) score += 20;
      }
      score += (genreCount[song.genre] || 0) * 50;
      if(song.promoted) score += 30;
      const recentPlays = user.playHistory.filter(s => s.title === song.title).length;
      score -= recentPlays * 20;
      score += Math.random() * 3;
      return {...song, score};
    });
    const sorted = scored.sort((a, b) => b.score - a.score);
    const algoPart = sorted.slice(0, MAX_RECOMMENDATIONS - 4);
    let randomPart = [];
    for(let i = 0; i < 4; i++){
      randomPart.push(generateSong());
    }
    const finalList = algoPart.concat(randomPart);
    currentPlaylist = finalList;
    recommendationsContainer.innerHTML = '';
    finalList.forEach((song, index) => {
      recommendationsContainer.appendChild(createSongCard(song, index));
    });
    recommendationsContainer.style.opacity = 1;
  },300);
}
function togglePlay() {
  isPlaying = !isPlaying;
  if(isPlaying) { currentTimer = setInterval(updateTimer, 1000); playPauseBtn.textContent = '⏸'; }
  else { clearInterval(currentTimer); playPauseBtn.textContent = '▶'; }
}
function updateTimer() {
  currentSeconds++;
  const mins = Math.floor(currentSeconds/60);
  const secs = currentSeconds % 60;
  songTimer.textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
}
function playSong(song, index) {
  if(currentTimer) clearInterval(currentTimer);
  currentSong = song;
  currentSongIndex = index;
  currentSeconds = 0;
  currentSongDisplay.textContent = `${song.title} - ${song.artist}`;
  songTimer.textContent = '0:00';
  nowPlaying.style.display = 'flex';
  if(!isPlaying) { isPlaying = true; playPauseBtn.textContent = '⏸'; }
  currentTimer = setInterval(updateTimer, 1000);
}
function playNext() {
  if(currentPlaylist.length > 0) {
    const nextIndex = (currentSongIndex+1) % currentPlaylist.length;
    user.playHistory.push(currentPlaylist[nextIndex]);
    playSong(currentPlaylist[nextIndex], nextIndex);
  }
}
function playPrevious() {
  if(currentPlaylist.length > 0) {
    const prevIndex = (currentSongIndex-1+currentPlaylist.length) % currentPlaylist.length;
    user.playHistory.push(currentPlaylist[prevIndex]);
    playSong(currentPlaylist[prevIndex], prevIndex);
  }
}
generateRecommendations();
