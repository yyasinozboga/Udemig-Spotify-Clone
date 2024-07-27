import { elements } from "./helpers.js";
import { API } from "./api.js";

let search = [];
let userTexT = null;
let songData = [];

//! API ye veri gönderme
elements.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const value = e.target[0].value;
  userTexT = value;

  if (value) {
    if (getTheLastItem(search) !== value.toUpperCase()) {
      elements.songList.innerHTML = "";
    }

    const results = new API();
    const songs = await results.getData(value);
    renderSongs(songs);
    search.push(value.toUpperCase());
    localStorage.setItem("songs", JSON.stringify(search));
  } else {
    throw new Error("Lütfen bir değer giriniz!");
  }

  elements.form.reset();
});

//! Listenin son elemanını alma
const getTheLastItem = (list) => {
  return list[list.length - 1];
};

//! API den gelen cevapı render etme
const renderSongs = (songs) => {
  songs.forEach((song) => {
    const card = document.createElement("li");
    card.classList.add("song");

    card.dataset.title = song.track.subtitle;
    card.dataset.song = song.track.title;
    card.dataset.img = song.track.images.coverart;
    card.dataset.url = song.track.hub.actions.pop().uri;

    card.innerHTML = `
        <figure class="song-img"><img src="${card.dataset.img}" /></figure>
        <div class="song-detail">
            <span>${card.dataset.title}</span>
            <span>${card.dataset.song}</span>
        </div>
        <button class="play-btn"><i class="bi bi-play-fill"></i></button>
    `;

    elements.songList.appendChild(card);
    elements.title.textContent = `${userTexT} için sonuçlar`;

    card.addEventListener("click", findTheSong);
  });
};

//! Tıklanılan müziğin verilerini alma
const findTheSong = (e) => {
  const ele = e.target;
  if (ele.parentElement.className === "play-btn") {
    const song = ele.closest(".song");
    playSong(song.dataset);
    songData.push(song.dataset);
    localStorage.setItem("songData", JSON.stringify(songData));
  }
};

//! Tıkladığımız şarkıyı çalma
const playSong = ({ img, song, url }) => {
  elements.footer.innerHTML = "";

  const div = document.createElement("div");
  div.classList.add("footer");
  div.innerHTML = `
    <div class="song-detail">
        <figure class="song-img"><img src="${img}" /></figure>

        <div class="song-detail-title">
          <span>Şu an oynatılıyor...</span>
          <h4>${song}</h4>
        </div>
    </div>

    <audio src="${url}" class="playing" controls autoplay></audio>
  `;

  const play = div.querySelector(".playing");
  const songImg = div.querySelector(".song-img");
  let interval = null;
  let count = 0;
  play.addEventListener("play", () => {
    interval = setInterval(() => {
      count++;
      songImg.style.transform = `rotate(${count}deg)`;

      count === 360 ? (count = 0) : (count = count);
    }, 10);
  });

  play.addEventListener("pause", () => {
    clearInterval(interval);
  });

  elements.footer.style.height = "100px";
  elements.footer.appendChild(div);
};

//! Kullanıcının en son dinlediği müziği sayfaya yükleme
window.addEventListener("DOMContentLoaded", async () => {
  const songs = JSON.parse(localStorage.getItem("songs"));
  if (songs) {
    const song = getTheLastItem(songs);
    const results = await new API().getData(song);
    renderSongs(results);
    const songData = JSON.parse(localStorage.getItem("songData"));
    playSong(getTheLastItem(songData));
    elements.title.textContent = "Kaldığınız yerden devam ediniz";
  }
});

//! Res Menu
elements.resMenuBtn.addEventListener("click", () => {
  elements.list.forEach((item) => {
    item.classList.toggle("active");
  });
});
