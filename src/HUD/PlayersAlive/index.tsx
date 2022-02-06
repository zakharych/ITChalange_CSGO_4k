import classNames from "classnames";
import { Player, Team } from "csgogsi-socket";
import React from "react";
import s from "./PlayersAlive.module.scss";
interface Props {
  left: Team;
  right: Team;
  leftPlayers: Player[];
  rightPlayers: Player[];
}

export default function PlayersAlive(props: Props) {
  const { left, right, leftPlayers, rightPlayers } = props;
  console.log(left.side);

  return (
    <div className={s.players_alive}>
      <div className={s.players_alive__title}>Players alive</div>
      <div className={s.players_alive__counter}>
        <div
          className={classNames(s.players_alive__team, [
            s[`players_alive__team--${left.side}`],
          ])}
        >
          {leftPlayers.filter((player) => player.state.health > 0).length}
        </div>
        <div className={s.players_alive__vs}>VS</div>
        <div
          className={classNames(s.players_alive__team, [
            s[`players_alive__team--${right.side}`],
          ])}
        >
          {rightPlayers.filter((player) => player.state.health > 0).length}
        </div>
      </div>
    </div>
  );
}
