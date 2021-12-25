import React from "react";
import { Player, WeaponRaw, Map } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import Armor from "./../Indicators/Armor";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";
import { Blind, Burning } from "./../../assets/Icons";
import { GSI } from "../../App";
interface IProps {
  player: Player;
  isObserved: boolean;
  isFreezetime: boolean;
}

interface IState {
  startRoundMoney: number;
}
export default class PlayerBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      startRoundMoney: 800,
    };
  }
  componentDidMount() {
    GSI.on("roundEnd", () => {
      this.setState({ startRoundMoney: this.props.player.state.money });
    });
  }
  render() {
    const { player, isFreezetime } = this.props;
    const weapons: WeaponRaw[] = Object.values(player.weapons).map(
      (weapon) => ({ ...weapon, name: weapon.name.replace("weapon_", "") })
    );
    const primary =
      weapons.filter(
        (weapon) =>
          !["C4", "Pistol", "Knife", "Grenade", undefined].includes(weapon.type)
      )[0] || null;
    const secondary =
      weapons.filter((weapon) => weapon.type === "Pistol")[0] || null;
    const grenades = weapons.filter((weapon) => weapon.type === "Grenade");
    const isLeft = player.team.orientation === "left";

    return (
      // <div
      //   className={`player ${player.state.health === 0 ? "dead" : ""} ${
      //     this.props.isObserved ? "active" : ""
      //   }`}
      // >
      //   <div className="player_data">
      //     <Avatar
      //       steamid={player.steamid}
      //       height={57}
      //       width={57}
      //       showSkull={false}
      //     />
      // <div className="dead-stats">
      //   <div className="labels">
      //     <div className="stat-labelK"></div>
      //     <div className="stat-valueKK">{player.stats.kills}</div>
      //   </div>
      //   <div className="values">
      //     <div className="stat-labelD"></div>
      //     <div className="stat-valueDD">{player.stats.deaths}</div>
      //   </div>
      // </div>
      //     <div className="player_stats">
      //       <div className="row">
      //         <div className="health">{player.state.health}</div>
      //         <div className="username">
      //           <div className="username_team">
      //             {" "}
      //             {isLeft ? <span></span> : null} {player.name}{" "}
      //             {!isLeft ? <span></span> : null}
      //           </div>
      //           <div className="weapon_team">
      //             {primary || secondary ? (
      //               <Weapon
      //                 weapon={primary ? primary.name : secondary.name}
      //                 active={
      //                   primary
      //                     ? primary.state === "active"
      //                     : secondary.state === "active"
      //                 }
      //               />
      //             ) : (
      //               ""
      //             )}
      //           </div>
      //         </div>
      //       </div>
      //       <div
      //         className={`hp_bar_red`}
      //         style={{ width: `${player.state.health}%` }}
      //       ></div>
      //       <div
      //         className={`hp_bar ${player.state.health <= 20 ? "low" : ""}`}
      //         style={{ width: `${player.state.health}%` }}
      //       ></div>
      //       <div className={`hp_bar2`}></div>
      //       {player.state.round_kills ? (
      //         <div className="roundkills-container">
      //           {player.state.round_kills}
      //         </div>
      //       ) : null}
      //       <div className="row">
      //         <div className="armor_and_utility">
      //           <Defuse player={player} />
      //           <Armor player={player} />
      //           <Bomb player={player} />
      //         </div>
      //         <div className="money">${player.state.money}</div>
      //         <div className="grenades">
      //           {grenades.map((grenade) => [
      //             <Weapon
      //               key={`${grenade.name}-${grenade.state}`}
      //               weapon={grenade.name}
      //               active={grenade.state === "active"}
      //               isGrenade
      //             />,
      //             grenade.ammo_reserve === 2 ? (
      //               <Weapon
      //                 key={`${grenade.name}-${grenade.state}-double`}
      //                 weapon={grenade.name}
      //                 active={grenade.state === "active"}
      //                 isGrenade
      //               />
      //             ) : null,
      //           ])}
      //         </div>
      //       </div>
      //       <div className="active_border"></div>
      //     </div>
      //   </div>
      //   <div className={`freezetime_KAD ${!isFreezetime ? "hide" : ""}`}>
      //     <div className="labels">
      //       <div className="stat-label">K</div>
      //       <div className="stat-label">A</div>
      //       <div className="stat-label">D</div>
      //     </div>
      //     <div className="values">
      //       <div className="stat-value">{player.stats.kills}</div>
      //       <div className="stat-value">{player.stats.assists}</div>
      //       <div className="stat-value">{player.stats.deaths}</div>
      //     </div>
      //   </div>
      //   <div className={`spending ${!isFreezetime ? "hide" : ""}`}>
      //     <div className="spent">
      //       {" "}
      //       -${Math.abs(player.state.money - this.state.startRoundMoney)}
      //     </div>
      //   </div>
      // </div>

      <div
        className={`player ${player.state.health === 0 ? "dead" : ""}${
          this.props.isObserved ? "active" : ""
        }`}
      >
        <Avatar steamid={player.steamid} showSkull={false} />
        <div className="player__panel">
          <div className="player__main-panel">
            <div className="player__info-bar">
              <div className="player__hp">{player.state.health}</div>
              <div className="player__name">
                {" "}
                {isLeft ? <span></span> : null} {player.name}{" "}
                {!isLeft ? <span></span> : null}
              </div>
            </div>
            <div
              className="player__hp-bar"
              style={{ width: `${player.state.health}%` }}
            ></div>
          </div>
          <ul className="player__game-info-list">
            <li className="player__game-info-wrapper">
              <div className="player__game-info-item">
                <div className="player__money">${player.state.money}</div>
                <div className="player__stuff">
                  <Defuse player={player} />
                  <Armor player={player} />
                  <Bomb player={player} />
                </div>
              </div>
              <div className="player__game-info-item">
                <div className="player__kills labels">
                  <div className="player__kills-icon"></div>
                  <div className="player__kills-count">
                    {player.stats.kills}
                  </div>
                </div>
                <div className="player__death values">
                  <div className="player__death-icon"></div>
                  <div className="player__death-count">
                    {player.stats.deaths}
                  </div>
                </div>
              </div>
            </li>
            <li className="player__game-info-wrapper">
              <div className="player__game-info-item player__guns">
                {primary || secondary ? (
                  <Weapon
                    weapon={primary ? primary.name : secondary.name}
                    active={
                      primary
                        ? primary.state === "active"
                        : secondary.state === "active"
                    }
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="player__game-info-item player__grenades">
                {grenades.map((grenade) => [
                  <Weapon
                    key={`${grenade.name}-${grenade.state}`}
                    weapon={grenade.name}
                    active={grenade.state === "active"}
                    isGrenade
                  />,
                  grenade.ammo_reserve === 2 ? (
                    <Weapon
                      key={`${grenade.name}-${grenade.state}-double`}
                      weapon={grenade.name}
                      active={grenade.state === "active"}
                      isGrenade
                    />
                  ) : null,
                ])}
              </div>
            </li>
          </ul>          
          <div className="player__active-border"></div>
        </div>
      </div>
    );
  }
}
