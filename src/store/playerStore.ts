import { create } from "zustand";
import { regularSongs, songs, Song } from "../data/songs";

interface PlayerState {
  currentSong: Song | null;
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: "none" | "all" | "one";
  queue: Song[];
  hasStarted: boolean;

  setCurrentSong: (song: Song) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  playSongAtIndex: (index: number) => void;
  playSongList: (list: Song[], index: number) => void;
  startRadio: () => void;
}

function getNextIndex(current: number, shuffle: boolean, repeat: "none" | "all" | "one", list: Song[]): number {
  if (repeat === "one") {
    return current;
  }

  let next: number;
  if (shuffle) {
    do {
      next = Math.floor(Math.random() * list.length);
    } while (next === current && list.length > 1);
  } else {
    next = current + 1;
    if (next >= list.length) {
      if (repeat === "all") {
        next = 0;
      } else {
        return -1;
      }
    }
  }
  return next;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
  isMuted: false,
  shuffle: false,
  repeat: "all",
  queue: regularSongs,
  hasStarted: false,

  setCurrentSong: (song) => set({ currentSong: song }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  togglePlay: () => {
    const state = get();
    if (!state.hasStarted) {
      state.startRadio();
      return;
    }
    set({ isPlaying: !state.isPlaying });
  },

  next: () => {
    const state = get();
    const nextIdx = getNextIndex(state.currentIndex, state.shuffle, state.repeat, state.queue);
    if (nextIdx === -1) {
      set({ isPlaying: false });
      return;
    }
    set({
      currentIndex: nextIdx,
      currentSong: state.queue[nextIdx],
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    });
  },

  previous: () => {
    const state = get();
    if (state.currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }
    let prevIdx: number;
    if (state.shuffle) {
      prevIdx = Math.floor(Math.random() * state.queue.length);
    } else {
      prevIdx = state.currentIndex - 1;
      if (prevIdx < 0) {
        prevIdx = state.repeat === "all" ? state.queue.length - 1 : 0;
      }
    }
    set({
      currentIndex: prevIdx,
      currentSong: state.queue[prevIdx],
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    });
  },

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),

  toggleMute: () => {
    const state = get();
    set({ isMuted: !state.isMuted });
  },

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

  cycleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === "none" ? "all" : s.repeat === "all" ? "one" : "none",
    })),

  playSongAtIndex: (index: number) => {
    const state = get();
    if (index >= 0 && index < state.queue.length) {
      set({
        currentIndex: index,
        currentSong: state.queue[index],
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        hasStarted: true,
      });
    }
  },

  playSongList: (list, index) => {
    if (index >= 0 && index < list.length) {
      set({
        queue: list,
        currentIndex: index,
        currentSong: list[index],
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        hasStarted: true,
      });
    }
  },

  startRadio: () => {
    set({
      currentIndex: 0,
      queue: regularSongs,
      currentSong: regularSongs[0],
      isPlaying: true,
      currentTime: 0,
      duration: 0,
      hasStarted: true,
    });
  },
}));
