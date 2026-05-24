import { CharacterSelect } from "./components/CharacterSelect";
import { EndingPage } from "./components/EndingPage";
import { GameScene } from "./components/GameScene";
import { HomePage } from "./components/HomePage";
import { characters, getCharacterById } from "./data/characters";
import { useGameStore } from "./services/gameStore";

export default function App() {
  const { screen, mode, playerRoleId, endingPayload, setMode, openCharacterSelect, startGame, finishGame, restart } =
    useGameStore();

  const playerRole = playerRoleId ? getCharacterById(playerRoleId) : undefined;

  if (screen === "character") {
    return <CharacterSelect characters={characters} mode={mode} onSelect={startGame} onBack={restart} />;
  }

  if (screen === "game" && playerRole) {
    return <GameScene playerRole={playerRole} mode={mode} onFinish={finishGame} />;
  }

  if (screen === "ending" && endingPayload && playerRole) {
    return <EndingPage payload={endingPayload} playerRole={playerRole} onRestart={restart} />;
  }

  return <HomePage mode={mode} onModeChange={setMode} onStart={openCharacterSelect} />;
}
