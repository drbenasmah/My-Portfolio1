<ol id="players" className="highlight-player">
  <Player
    initialName={PLAYERS.X}
    symbol="X"
    isActive={activePlayer === "X"}
    onChangeName={handlePlayerNameChange}
  />
  <Player
    initialName={PLAYERS.O}
    symbol="O"
    isActive={activePlayer === "O"}
    onChangeName={handlePlayerNameChange}
  />
</ol>;
