import React from "react";
import { Player } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import "./observed.scss";
// import { getCountry } from "./../countries";
import {
  ArmorHelmet,
  ArmorFull,
  HealthFull,
  Bullets,
} from "./../../assets/Icons";
import { Veto } from "../../api/interfaces";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";

export default class Observed extends React.Component<{
  player: Player | null;
  veto: Veto | null;
  round: number;
}> {
  getAdr = () => {
    const { veto, player } = this.props;
    if (!player || !veto || !veto.rounds) return null;
    const damageInRounds = veto.rounds
      .map((round) => round.players[player.steamid])
      .filter((data) => !!data)
      .map((roundData) => roundData.damage);
    return damageInRounds.reduce((a, b) => a + b, 0) / (this.props.round - 1);
  };
  render() {
    if (!this.props.player) return "";
    const { player } = this.props;
    // const country = player.country || player.team.country;
    const weapons = Object.values(player.weapons).map((weapon) => ({
      ...weapon,
      name: weapon.name.replace("weapon_", ""),
    }));
    const currentWeapon = weapons.filter(
      (weapon) => weapon.state === "active"
    )[0];
    const grenades = weapons.filter((weapon) => weapon.type === "Grenade");
    // const { stats } = player;
    // const ratio = stats.deaths === 0 ? stats.kills : stats.kills / stats.deaths;
    // const countryName = country ? getCountry(country) : null;
    // const adr = this.getAdr() !== null ? this.getAdr() : "0";
    let ADR: number | string | null;
    ADR = this.getAdr();
    if (ADR == null || ADR === Infinity || isNaN(ADR)) ADR = "-";
    else ADR = ADR.toFixed(0);
    return (
      <div className={`observed ${player.team.side}`}>
        <div className="info-bar">
          <Avatar
            steamid={player.steamid}
            height={181}
            width={181}
            showCam={true}
            slot={player.observer_slot}
          />
          <div className="info-bar__info">
            <div className="username-container">
              <div className="username">{player.name}</div>
              <div className="real_name">{player.realName}</div>
            </div>
            <div className="tools-container">
              <Bomb player={player} />
              <Defuse player={player} />

              <div className="grenade_container">
                {grenades.map((grenade) => (
                  <React.Fragment
                    key={`${player.steamid}_${grenade.name}_${
                      grenade.ammo_reserve || 1
                    }`}
                  >
                    <Weapon
                      weapon={grenade.name}
                      active={grenade.state === "active"}
                      isGrenade
                    />
                    {grenade.ammo_reserve === 2 ? (
                      <Weapon
                        weapon={grenade.name}
                        active={grenade.state === "active"}
                        isGrenade
                      />
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="player-bar__status">
          <div className="health-and-armor">
            <div className="health-and-armor__info-health">
              <div className="health-and-armor__icon-health">
                <HealthFull />
              </div>
              <div className="health-and-armor__text-health">
                {player.state.health}
              </div>
            </div>
            <div className="health-and-armor__info-armor">
              <div className="health-and-armor__icon-armor">
                {player.state.helmet ? <ArmorHelmet /> : <ArmorFull />}
              </div>
              <div className="health-and-armor__text-armor">
                {player.state.armor}
              </div>
            </div>
          </div>
          <div className="statistics">
            {player.state.round_kills ? (
              <div className="player-kills-round">
                {player.state.round_kills}
              </div>
            ) : null}
            <div className="player__KDA">
              <ul className="player__KDA-list">
                <li className="player__KDA-item">
                  <div className="player__KDA-name">K</div>
                  <div className="player__KDA-value">{player.stats.kills}</div>
                </li>
                <li className="player__KDA-item">
                  <div className="player__KDA-name">A</div>
                  <div className="player__KDA-value">
                    {player.stats.assists}
                  </div>
                </li>
                <li className="player__KDA-item">
                  <div className="player__KDA-name">D</div>
                  <div className="player__KDA-value">{player.stats.deaths}</div>
                </li>
              </ul>
            </div>
            <div className="ADR">
              <div className="ADR__lable">ADR</div>
              <div className="ADR__value">{ADR}</div>
            </div>
            <div className="ammo">
              <div className="ammo_icon_container">
                <Bullets />
                <div className="ammo_counter">
                  <div className="ammo_clip">
                    {(currentWeapon && currentWeapon.ammo_clip) || "-"}
                  </div>
                  <div className="ammo_reserve">
                    /{(currentWeapon && currentWeapon.ammo_reserve) || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
