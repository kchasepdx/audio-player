import {
  ArrowBigLeftIcon,
  ArrowBigRightIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  ShuffleIcon,
  StopCircleIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import playlists from "./data/playlists.json";

type Track = {
  name: string;
  url: string;
  duration: number;
};

type Playlist = {
  name: string;
  artist: string;
  tracks: Track[];
  year: number;
};

type Song = {
  id: number;
  name: string;
  artist: string;
  album: string;
  year: number;
  playlist: string;
  url: string;
};

function App() {
  const [musicInfo, setMusicInfo] = useState<Song>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const songArr: Song[] = [];
  const playlistArr: Playlist[] = playlists.playlists;
  playlistArr.map((list: Playlist) => {
    list.tracks.map((song: Track, index: number) => {
      songArr.push({
        id: index,
        name: song.name,
        artist: list.artist,
        album: list.name,
        year: list.year,
        playlist: list.name,
        url: song.url,
      });
    });
  });

  const firstSong = songArr[0];

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (!musicInfo) {
      setMusicInfo(songArr[0]);
      audioRef.current = new Audio(firstSong.url);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => console.error("Play error:", err));
      return;
    }

    audioRef.current = new Audio(musicInfo?.url);
    audioRef.current.currentTime = currentTime;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => console.error("Play error:", err));
  };

  const pauseAudio = () => {
    if (!audioRef.current) {
      return;
    }
    setCurrentTime(audioRef.current.currentTime);
    setIsPlaying(false);
    if (audioRef?.current) {
      audioRef.current.pause();
    }
  };

  const stopAudio = () => {
    if (!audioRef.current) {
      return;
    }
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current = null;
    setCurrentTime(0);
  };

  const shuffleAudio = () => {
    setCurrentTime(0);
    setIsPlaying(true);

    if (audioRef?.current) {
      audioRef.current.pause();
    }
    const randomIndex = Math.floor(Math.random() * songArr.length);
    const randomSong = songArr[randomIndex];
    audioRef.current = new Audio(randomSong.url);
    audioRef.current.play();
    setMusicInfo(randomSong);
  };

  const nextSong = () => {
    if (!musicInfo) return;
    setCurrentTime(0);
    const currentIndex = songArr.findIndex((song) => song.id === musicInfo?.id);
    const nextIndex = (currentIndex + 1) % songArr.length;
    const nextSong = songArr[nextIndex];

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(nextSong.url);
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => console.error("Play error:", err));

    setMusicInfo(nextSong);
  };

  const prevSong = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    if (!musicInfo) {
      return;
    }
    const currentIndex = songArr.findIndex((song) => song.id === musicInfo?.id);
    const prevIndex = (currentIndex - 1 + songArr.length) % songArr.length;
    const prevSong = songArr[prevIndex];
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(prevSong.url);
    audioRef.current.play();
    setMusicInfo(prevSong);
  };

  console.log("current audioRef", audioRef.current);

  return (
    <div id="mainContainer">
      <div id="musicInfoDiv">
        <div>Song: {musicInfo?.name}</div>
        <br />
        <div>Artist: {musicInfo?.artist}</div>
        <br />
        <div>Album: {musicInfo?.album}</div>
        <br />
        <div>Year:{musicInfo?.year}</div>
        <br />
        <div>Playlist: {musicInfo?.playlist}</div>
        <br />
      </div>

      <div id="controlsDiv">
        <div id="basicControls" className="flex">
          <button
            type="button"
            id="previousButton"
            onClick={prevSong}
            onKeyDown={(e) => e.key === "ArrowLeft" && prevSong()}
            className="unstyled-button"
          >
            <ArrowBigLeftIcon className="icon-size" />
          </button>
          <button
            type="button"
            id="playButton"
            onClick={playAudio}
            onKeyDown={(e) => e.key === " " && playAudio()}
            className="unstyled-button"
          >
            <PlayCircleIcon
              color={isPlaying ? "greenyellow" : "white"}
              className="icon-size"
            />
          </button>
          <button
            type="button"
            id="nextButton"
            onClick={nextSong}
            onKeyDown={(e) => e.key === "ArrowRight" && nextSong()}
            className="unstyled-button"
          >
            <ArrowBigRightIcon className="icon-size" />
          </button>
        </div>
        <div id="extraControls" className="flex">
          <button
            type="button"
            id="pauseButton"
            onClick={pauseAudio}
            onKeyDown={(e) => e.key === " " && pauseAudio()}
            className="unstyled-button"
          >
            <PauseCircleIcon size="5rem" />
          </button>
          <button
            type="button"
            id="stopButton"
            onClick={stopAudio}
            onKeyDown={(e) => e.key === "Enter" && stopAudio()}
            className="unstyled-button"
          >
            <StopCircleIcon size="5rem" />
          </button>
          <button
            type="button"
            id="shuffleButton"
            onClick={shuffleAudio}
            onKeyDown={(e) => {
              if (e.key === "s") shuffleAudio();
            }}
            className="bg-transparent unstyled-button border-none p-0 m-0 cursor-pointer text-black" // 👈 sets icon color
          >
            <ShuffleIcon size="5rem" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
