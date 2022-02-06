import React from "react";
import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import SeriesBox, { OrganizerLogo, SeriesInfo } from "../MatchBar/SeriesBox";
import Observed from "./../Players/Observed";
import { CSGO, Team } from "csgogsi-socket";
import { Match } from "../../api/interfaces";
import RadarMaps from "./../Radar/RadarMaps";
import Trivia from "../Trivia/Trivia";
import SideBox from "../SideBoxes/SideBox";
import { GSI, actions } from "./../../App";
import MoneyBox from "../SideBoxes/Money";
import UtilityLevel from "../SideBoxes/UtilityLevel";
import Killfeed from "../Killfeed/Killfeed";
import MapSeries from "../MapSeries/MapSeries";
import Overview from "../Overview/Overview";
import Tournament from "../Tournament/Tournament";
import Pause from "../PauseTimeout/Pause";
import Timeout from "../PauseTimeout/Timeout";
import MVP from "./../MVP/mvp";
import Firepower from "../Firepower/firepower";

interface Props {
  game: CSGO;
  match: Match | null;
}

interface State {
  winner: Team | null;
  showWin: boolean;
  forceHide: boolean;
  teamBoxHeight: Number;
}

export default class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      winner: null,
      showWin: false,
      forceHide: false,
      teamBoxHeight: 0,
    };
  }

  componentDidMount() {
    GSI.on("roundEnd", (score) => {
      this.setState({ winner: score.winner, showWin: true }, () => {
        setTimeout(() => {
          this.setState({ showWin: false });
        }, 4000);
      });
    });
    actions.on("boxesState", (state: string) => {
      if (state === "show") {
        this.setState({ forceHide: false });
      } else if (state === "hide") {
        this.setState({ forceHide: true });
      }
    });
  }

  updateTeamBoxHeight = (height: Number) => {
    this.setState({ teamBoxHeight: height });
  };
  getVeto = () => {
    const { game, match } = this.props;
    const { map } = game;
    if (!match) return null;
    const mapName = map.name.substring(map.name.lastIndexOf("/") + 1);
    const veto = match.vetos.find((veto) => veto.mapName === mapName);
    if (!veto) return null;
    return veto;
  };

  render() {
    const { game, match } = this.props;
    const left =
      game.map.team_ct.orientation === "left"
        ? game.map.team_ct
        : game.map.team_t;
    const right =
      game.map.team_ct.orientation === "left"
        ? game.map.team_t
        : game.map.team_ct;
    const leftPlayers = game.players.filter(
      (player) => player.team.side === left.side
    );
    const rightPlayers = game.players.filter(
      (player) => player.team.side === right.side
    );
    const leftPlayersAlive = leftPlayers.filter(
      (player) => player.state.health > 0
    );
    const rightPlayersAlive = rightPlayers.filter(
      (player) => player.state.health > 0
    );
    const EquipmentFull =
      rightPlayersAlive
        .map((player) => player.state.equip_value)
        .reduce((pre, now) => pre + now, 0) +
      leftPlayersAlive
        .map((player) => player.state.equip_value)
        .reduce((pre, now) => pre + now, 0);
    const isFreezetime =
      (game.round && game.round.phase === "freezetime") ||
      game.phase_countdowns.phase === "freezetime";
    const isUtilityLevel =
      (game.round && game.round.phase === "freezetime") ||
      game.phase_countdowns.phase === "bomb";
    const isFirepower =
      (game.round && game.round.phase === "freezetime") ||
      game.phase_countdowns.phase === "live" ||
      game.phase_countdowns.phase === "over" ||
      game.phase_countdowns.phase === "warmup";
    const { forceHide } = this.state;

    return (
      <div className="layout">
        <div className={`players_alive`}>
          <div className="title_container">Players alive</div>
          <div className="counter_container">
            <div className={`team_counter ${left.side}`}>
              {leftPlayers.filter((player) => player.state.health > 0).length}
            </div>
            <div className={`vs_counter`}>VS</div>
            <div className={`team_counter ${right.side}`}>
              {rightPlayers.filter((player) => player.state.health > 0).length}
            </div>
          </div>
        </div>
        <Killfeed />
        <Overview match={match} map={game.map} players={game.players || []} />
        <RadarMaps match={match} map={game.map} game={game} />
        <MatchBar
          map={game.map}
          phase={game.phase_countdowns}
          bomb={game.bomb}
          match={match}
        />

        <MVP
          isFreezetime={isFreezetime}
          veto={this.getVeto()}
          round={game.map.round + 1}
        />
        <Pause phase={game.phase_countdowns} />
        <Timeout map={game.map} phase={game.phase_countdowns} />
        <SeriesBox map={game.map} phase={game.phase_countdowns} match={match} />
        <SeriesInfo map={game.map} match={match} />
        <OrganizerLogo />

        <Tournament />

        <Observed
          player={game.player}
          veto={this.getVeto()}
          round={game.map.round + 1}
        />

        <TeamBox
          team={left}
          players={leftPlayers}
          side="left"
          current={game.player}
          isFreezetime={isFreezetime}
          setTeamBoxHeight={this.updateTeamBoxHeight}
        />
        <TeamBox
          team={right}
          players={rightPlayers}
          side="right"
          current={game.player}
          isFreezetime={isFreezetime}
        />

        <Trivia />

        <MapSeries
          teams={[left, right]}
          match={match}
          isFreezetime={isFreezetime}
          map={game.map}
        />
        <SideBox side="left" offset={this.state.teamBoxHeight}>
          <MoneyBox
            team={left.side}
            side="left"
            loss={Math.min(left.consecutive_round_losses * 500 + 1400, 3400)}
            equipment={leftPlayers
              .map((player) => player.state.equip_value)
              .reduce((pre, now) => pre + now, 0)}
            money={leftPlayers
              .map((player) => player.state.money)
              .reduce((pre, now) => pre + now, 0)}
            show={isFreezetime}
          />
          <UtilityLevel
            side={left.side}
            players={game.players}
            show={isUtilityLevel}
          />
        </SideBox>
        <SideBox side="right" offset={this.state.teamBoxHeight}>
          <MoneyBox
            team={right.side}
            side="right"
            loss={Math.min(right.consecutive_round_losses * 500 + 1400, 3400)}
            equipment={rightPlayers
              .map((player) => player.state.equip_value)
              .reduce((pre, now) => pre + now, 0)}
            money={rightPlayers
              .map((player) => player.state.money)
              .reduce((pre, now) => pre + now, 0)}
            show={isFreezetime}
          />
          <UtilityLevel
            side={right.side}
            players={game.players}
            show={isUtilityLevel}
          />
        </SideBox>
      </div>
    );
  }
}
