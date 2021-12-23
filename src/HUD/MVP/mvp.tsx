import React from "react";
import { Player } from "csgogsi-socket";
import { GSI } from "../../App";
import Avatar from './../Players/Avatar';
import "./mvp.scss";
import { Veto } from "../../api/interfaces";
import * as I from "csgogsi-socket";
import { Match } from "../../api/interfaces";
import TeamLogo from "./../MatchBar/TeamLogo";
interface State {
    player: Player | null;
    show: boolean;
    round: number;
}

interface IProps {
    map: I.Map;
}
export default class MVP extends React.Component<{isFreezetime:boolean, veto: Veto | null, round: number,}, State, IProps> {

    constructor(p: {isFreezetime:boolean, veto: Veto | null, round: number}){
        super(p);
        this.state = {
            player: null,
            show: false,
            round: 0,
        }
    }
	getAdr = () => {
        const { veto } = this.props;
        const { player } = this.state;
		if (!player || !veto || !veto.rounds) return null;
		const damageInRounds = veto.rounds.map(round => round.players[player.steamid]).filter(data => !!data).map(roundData => roundData.damage);
        const adr = damageInRounds.reduce((a, b) => a + b, 0) / (this.props.round - 1);
		return adr.toFixed(0);
	}
    componentDidMount(){
        GSI.on("data", data => {
            if(data.phase_countdowns.phase === "freezetime"){
                this.setState({show: true});
            }
            else {
                this.setState({show: false});
            }
        })
        GSI.on("mvp", player => {
            this.setState({
                player,
                show: true,
            });
        })
    }
  render() {
    const { player, show, } = this.state;
    const map = this.props;
    const round = map.round - 1;
    if(!player) return null;
    return (
      <div className={`mvp ${show ? 'show':'hide'}`}>
          <div className={`data-container ${player.team.side} ${show ? 'show':'hide'}`}>
              <div className={`damageinround ${player.team.side}`}>
                  <div className="damageinround">DAMAGE ROUND</div>
                  <div className={`data-damageinround ${player.team.side}`}>{player.state.round_totaldmg}
              </div>
              </div>
              <div className={`data-entry ${player.team.side}`}>
                  <div className="data-kills">KILLS</div>
                  <div className={`dkills ${player.team.side}`}>{player.state.round_kills}
              </div>
              
              <div className={`data-entry ${player.team.side}`}>
                  <div className="data-round-damage">ADR</div>
                  <div className={`round-damage ${player.team.side}`}>{this.getAdr()}
              </div>
              </div>
              <div className={`avatar-container  ${player.team.side} ${show ? 'show':'hide'}`}>
              <div className="avatar">
                <Avatar steamid={player.steamid} width={170} height={170}/>
              </div>
              <div className={`nickname ${player.team.side}`}>
                  {player.name}
                
              </div>
              <div className="realname">{player.realName}</div>
          </div>
          <div className="logo_MVP">
          <TeamLogo team={player.team} height={35} width={35} />
              </div>
              </div>
              <div className={`MVP_text ${player.team.side}`}>MVP</div>
          </div>
          <div className="MVP_fon"></div>
      </div>

    );
  }
}
