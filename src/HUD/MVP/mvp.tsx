import React from "react";
import { Player } from "csgogsi-socket";
import { GSI } from "../../App";
import Avatar from "./../Players/Avatar";
import "./mvp.scss";
import { Veto } from "../../api/interfaces";
import * as I from "csgogsi-socket";
import TeamLogo from "./../MatchBar/TeamLogo";
import classNames from "classnames";
interface State {
  player: Player | null;
  show: boolean;
  round: number;
}

interface IProps {
  map: I.Map;
}
export default class MVP extends React.Component<
  { isFreezetime: boolean; veto: Veto | null; round: number },
  State,
  IProps
> {
  constructor(p: { isFreezetime: boolean; veto: Veto | null; round: number }) {
    super(p);
    this.state = {
      player: null,
      show: false,
      round: 0,
    };
  }

  getAdr = () => {
    const { veto, player } = this.props;
    if (!player || !veto || !veto.rounds) return null;
    const damageInRounds = veto.rounds
      .map((round) => round.players[player.steamid])
      .filter((data) => !!data)
      .map((roundData) => roundData.damage);
    return damageInRounds.reduce((a, b) => a + b, 0) / (this.props.round - 1);
  };
  componentDidMount() {
    GSI.on("data", (data) => {
      if (data.phase_countdowns.phase === "freezetime") {
        this.setState({ show: true });
      } else {
        this.setState({ show: false });
      }
    });
    GSI.on("mvp", (player) => {
      this.setState({
        player,
        show: true,
      });
    });
  }
  render() {
    const { player, show } = this.state;
    if (!player) return null;
    return (
      <div
        className={classNames(
          "mvp",
          { "mvp--show": show },
          { "mvp--hide": !show },
          { [`mvp--${player.team.side}`]: player }
        )}
      >
        <div className="mvp__row">
          <div className="kills">
            <div className="kills__title">KILLS</div>
            <div className="kills__count">{player.state.round_kills}</div>
          </div>
          <div className="mvp_title">MVP</div>
        </div>
        <div className="mvp__row">
          <div className="damage-in-round">
            <div className="damage-in-round__title">DAMAGE ROUND</div>
            <div className="damage-in-round__count">
              {player.state.round_totaldmg}
            </div>
          </div>
          <div className="ADR_title">ADR</div>
        </div>
        <div className="mvp_avatar">
          <Avatar steamid={player.steamid} />
        </div>
        <div className="mvp_player_info">
          <div className="mvp_player_info__info">
            <div className="mvp_player_info__nick-name">{player.name}</div>
            <div className="mvp_player_info__name">{player.realName}</div>
          </div>
          <div className="mvp_player_info__team-logo">
            <TeamLogo team={player.team} />
          </div>
        </div>
      </div>
    );
  }
}
