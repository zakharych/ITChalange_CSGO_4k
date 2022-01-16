import React, { useEffect, useRef } from "react";
import Player from "./Player";
import * as I from "csgogsi-socket";
import "./players.scss";

interface Props {
  players: I.Player[];
  team: I.Team;
  side: "right" | "left";
  current: I.Player | null;
  isFreezetime: boolean;
  setTeamBoxHeight?: (s: number) => void;
}

export default function TeamBox(props: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      const newHeight = listRef.current.clientHeight;
      if (props.setTeamBoxHeight) {
        props.setTeamBoxHeight(newHeight);
      }
    }
  }, [listRef, props]);

  return (
    <div ref={listRef} className={`teambox ${props.team.side} ${props.side}`}>
      {props.players.map((player) => (
        <Player
          key={player.steamid}
          player={player}
          isObserved={
            !!(props.current && props.current.steamid === player.steamid)
          }
          isFreezetime={props.isFreezetime}
        />
      ))}
    </div>
  );
}
