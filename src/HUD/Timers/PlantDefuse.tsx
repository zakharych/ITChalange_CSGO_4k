import React from "react";

import { Timer } from "../MatchBar/MatchBar";
import { Player } from "csgogsi";
import * as I from "./../../assets/Icons";

interface IProps {
  timer: Timer | null;
  side: "right" | "left"
}
function percentageToClock(percentage: number, type: 'defusing' | 'planting', is5sDefuse?: boolean) {
  let maxTime = 40;
  if(type === "defusing"){
    maxTime = is5sDefuse ? 5 : 10;
  }

  return (maxTime*percentage/100).toFixed(2);
}

export default class Bomb extends React.Component<IProps> {
  getCaption = (type: "defusing" | "planting", player: Player | null) => {
    if(!player) return null;
    if(type === "defusing"){
      return <>
        <div className={'W'}>{player.name}  </div>
      </>;
    }
    return <>
      <div className={'W'}>{player.name} <br/>PLANTING BOMB</div>
    </>;
  }
  render() {
    const { side, timer } = this.props;

    let clock = '';
    if(timer){
      const { player, width, type } = timer;
      clock = percentageToClock(width, type, !!(player && player.state.defusekit))
    }

    return (
      <div className={`defuse_plant_container ${side} ${(timer && timer.type) || ''} ${timer && timer.active ? 'show' :'hide'}`}>
        {
          timer ?
          <div className={`defuse_plant_caption`}>
            {this.getCaption(timer.type, timer.player)}
          </div> : null
        }
        <div className={`defuse_timer ${(timer && timer.type) || ''} ${timer && timer.active ? 'show' :'hide'}`}> {clock} </div>
        <div className={`defuse_timer1 ${(timer && timer.type) || ''} ${timer && timer.active ? 'show' :'hide'}`}> DEFUSING THE BOMB </div>
          
          <div className="defuse_plant_bar" style={{ width: `${(timer && timer.width) || 0}%` }}></div>
      </div>
    );
  }
}