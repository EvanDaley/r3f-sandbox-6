import create from 'zustand'
// import ConnectPage from "../modules/networking_focus/connect_page/ConnectPage";
// import ConnectPageOverlay from "../modules/networking_focus/connect_page/ConnectPageOverlay";
// import LandingArea from "../modules/simple_playable_areas/LandingArea";
import Courtyard from "../modules/courtyard/Courtyard";
import CharacterControllerUI from "../modules/courtyard/components/CharacterControllerUI";

const scenes = [
  // { id: 'connectPage', name: 'Join Game', scene: ConnectPage, overlay: ConnectPageOverlay },
  { id: 'courtyard', name: 'Courtyard', scene: Courtyard, overlay: CharacterControllerUI },
  // { id: 'lobby', name: 'Lobby', scene: Lobby },
  // { id: 'office', name: 'Office', scene: Office },
  // { id: 'hallway', name: 'Hallway', scene: Hallway },
  // { id: 'bathroom', name: 'Bathroom', scene: Bathroom },
  // { id: 'kitchen', name: 'Kitchen', scene: Kitchen },
  // { id: 'livingRoom', name: 'Living Room', scene: LivingRoom },
  // { id: 'bedroom', name: 'Bedroom', scene: Bedroom },
]

let defaultScene = 'courtyard'

// On the prod version, always default to connectPage. When testing locally,
if (window.location.hostname !== 'localhost') {
  defaultScene = 'courtyard';
}

const useSceneStore = create((set) => ({
  currentSceneId: defaultScene,
  scenes,
  setSceneId: (id) => set({ currentSceneId: id }),
}))

export default useSceneStore
