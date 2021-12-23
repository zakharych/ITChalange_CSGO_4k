import React from "react";
import * as I from "csgogsi-socket";
import { Match, Veto } from '../../api/interfaces';
import TeamLogo from "../MatchBar/TeamLogo";
import "./mapseries.scss";

interface IProps {
    match: Match | null;
    teams: I.Team[];
    isFreezetime: boolean;
    map: I.Map
}

interface IVetoProps {
    veto: Veto;
    teams: I.Team[];
    active: boolean;
}

class VetoEntry extends React.Component<IVetoProps> {
    render(){
        const { veto, teams, active } = this.props;
        if(veto.type === "decider") {
        return <div className={`veto_container ${active ? 'active' : ''} ${veto.mapName} `}>
            <div className="veto_map_name">{veto.mapName.replace("de_","")}
            </div>
            <div className="veto_decider">
                DECIDER
            </div>
            <div className="veto_winner">
                <TeamLogo team={teams.filter(team => team.id === veto.winner)[0]} />
            </div>
            <div className="veto_score">
                {Object.values((veto.score || ['-','-'])).sort().join(":")}
            </div>
            <div className='active_container'>
                <div className='active'>PLAYING NOW</div>
            </div>
        </div>
    }


return <div className={`veto_container ${active ? 'active' : ''} ${veto.mapName} `}>
            <div className="veto_map_name">{veto.mapName.replace("de_","")}
            </div>
            <div className="veto_picker">
                <TeamLogo team={teams.filter(team => team.id === veto.teamId)[0]} />  
            </div>
            <div className="veto_winner">
                <TeamLogo team={teams.filter(team => team.id === veto.winner)[0]} />
            </div>
            <div className="veto_score">
                {Object.values((veto.score || ['-','-'])).sort().join(":")}
            </div>
            <div className='active_container'>
                <div className='active'>PLAYING NOW</div>
            </div>
        </div>
    }
}

export default class MapSeries extends React.Component<IProps> {

    render() {
        const { match, teams, isFreezetime, map } = this.props;
        if (!match || !match.vetos.length) return null;
        return (
            <div className={`map_series_container ${isFreezetime ? 'show': 'hide'}`}>
                <div className="title_bar">
                <div className="mapes">MAP</div>
                    <div className="picked">PICKED</div>
                    <div className="winner">WINNER</div>
                    <div className="score">SCORE</div>
                </div>
                {match.vetos.filter(veto => veto.type !== "ban").map(veto => {
                    if(!veto.mapName) return null;
                    return <VetoEntry veto={veto} teams={teams} active={map.name.includes(veto.mapName)}/>
                })}
            </div>
        );
    }
}
