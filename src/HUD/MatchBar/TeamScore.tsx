import React from "react";
import * as I from "csgogsi-socket";
import WinIndicator from "./WinIndicator";
import { Timer } from "./MatchBar";
import TeamLogo from './TeamLogo';
import PlantDefuse from "../Timers/PlantDefuse"
import BombTimer from "../Timers/BombTimer"

interface IProps {
  team: I.Team;
  orientation: "left" | "right";
  timer: Timer | null;
  showWin: boolean;
}

export default class TeamScore extends React.Component<IProps> {
  render() {
    const { orientation, timer, team, showWin } = this.props;
    return (
      <>
        <div className={`team ${orientation} ${team.side}`}>
        <TeamLogo team={team}  />
          <div className="team-name">{team.name}</div>
       
        </div>
        <PlantDefuse timer={timer} side={orientation} />
        <BombTimer  team={team} side = {team.side} orientation={team.orientation} />
        <WinIndicator team={team} show={showWin}/>
      </>
    );
  }
}
