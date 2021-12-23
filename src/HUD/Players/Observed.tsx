import React from "react";
import { Player } from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import TeamLogo from "./../MatchBar/TeamLogo";
import "./observed.scss";
import { apiUrl } from './../../api/api';
import { getCountry } from "./../countries";
import { ArmorHelmet, ArmorFull, HealthFull, Bullets } from './../../assets/Icons';
import { Veto } from "../../api/interfaces";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";

class Statistic extends React.PureComponent<{ label: string; value: string | number, }> {
	render() {
		return (
			<div className="stat">
				<div className="label">{this.props.label}</div>
				<div className="value">{this.props.value}</div>
			</div>
		);
	}
}

export default class Observed extends React.Component<{ player: Player | null, veto: Veto | null, round: number }> {
	getAdr = () => {
		const { veto, player } = this.props;
		if (!player || !veto || !veto.rounds) return null;
		const damageInRounds = veto.rounds.map(round => round.players[player.steamid]).filter(data => !!data).map(roundData => roundData.damage);
		return damageInRounds.reduce((a, b) => a + b, 0) / (this.props.round - 1);
	}
	render() {
		if (!this.props.player) return '';
		const { player } = this.props;
		const country = player.country || player.team.country;
		const weapons = Object.values(player.weapons).map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
		const currentWeapon = weapons.filter(weapon => weapon.state === "active")[0];
		const grenades = weapons.filter(weapon => weapon.type === "Grenade");
		const { stats } = player;
		const ratio = stats.deaths === 0 ? stats.kills : stats.kills / stats.deaths;
		const countryName = country ? getCountry(country) : null;
		// const adr = this.getAdr() !== null ? this.getAdr() : "0";
		let ADR: number | string | null;
        ADR = this.getAdr();
        if (ADR == null || ADR === Infinity || ADR == NaN) ADR="-";
        else
            ADR = ADR.toFixed(0);
		return (
			<div className={`observed ${player.team.side}`}>
				<div className="main_row">
					<Avatar steamid={player.steamid} height={181} width={181} showCam={true} slot={player.observer_slot}/>
					<div className="username_container">
						<div className="username">{player.name}</div>
						<div className="real_name">{player.realName}</div>
					</div>
					<div className="grenade_container">
					<Bomb player={player} />
                <Defuse player={player} />
						{grenades.map(grenade => <React.Fragment key={`${player.steamid}_${grenade.name}_${grenade.ammo_reserve || 1}`}>
							<Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade />
							{ 
							grenade.ammo_reserve === 2 ? <Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade /> : null }
						</React.Fragment>)}
					</div>
				</div>
				<div className="stats_row">
					<div className="health_armor_container">
						<div className="health-icon icon">
							<HealthFull />
						</div>
						<div className="health text">{player.state.health}</div>
						<div className="armor-icon icon">
							{player.state.helmet ? <ArmorHelmet /> : <ArmorFull />}
						</div>
						<div className="health text">{player.state.armor}</div>
						{player.state.round_kills ? <div className="roundkillscontainer">{player.state.round_kills}</div> : null}
					</div>
					<div className="statistics">
					<div className="label_KK">K</div>
              <div className="stat-valueK">{player.stats.kills}</div>
              <div className="label_AA">A</div>
              <div className="stat-valueA">{player.stats.assists}</div>
              <div className="label_DD">D</div>
              <div className="stat-valueD">{player.stats.deaths}</div>
			  <div className="label_ADR">ADR</div>
              <div className="stat-valueADR">{ADR}</div>
					</div>
					<div className="ammo">
					<div className="ammo_icon_container">
							<Bullets />
						<div className="ammo_counter">
							<div className="ammo_clip">{(currentWeapon && currentWeapon.ammo_clip) || "-"}</div>
							<div className="ammo_reserve">/{(currentWeapon && currentWeapon.ammo_reserve) || "-"}</div>
						</div>
					</div>
				</div>
				</div>
				</div>
		);
	}
}

