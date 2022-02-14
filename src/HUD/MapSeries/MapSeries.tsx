import React from "react";
import * as I from "csgogsi-socket";
import { Match, Veto } from "../../api/interfaces";
import TeamLogo from "../MatchBar/TeamLogo";
import "./mapseries.scss";

interface IProps {
  match: Match | null;
  teams: I.Team[];
  isFreezetime: boolean;
  map: I.Map;
}

interface IVetoProps {
  veto: Veto;
  teams: I.Team[];
  active: boolean;
}

class VetoEntry extends React.Component<IVetoProps> {
  render() {
    const { veto, teams, active } = this.props;
    console.log(veto);

    return (
      <div
        className={`veto_container ${veto.mapName} ${active ? "active" : ""}`}
      >
        <div className={`veto_map_name `}>
          {veto.mapName.replace("de_", "")}
        </div>
        {veto.type === "decider" ? (
          <div className="veto_decider">DECIDER</div>
        ) : (
          <div className="veto_picker">
            <TeamLogo
              team={teams.filter((team) => team.id === veto.teamId)[0]}
            />
          </div>
        )}
        {active ? (
          <div className="active-container">PLAYING NOW</div>
        ) : (
          <>
            <div className="veto_winner">
              <TeamLogo
                team={teams.filter((team) => team.id === veto.winner)[0]}
              />
            </div>
            <div className="veto_score">
              {Object.values(veto.score || ["-", "-"])
                .sort()
                .join(":")}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default class MapSeriesNew extends React.Component<IProps> {
  render() {
    const { match, teams, isFreezetime, map } = this.props;
    if (!match || !match.vetos.length) return null;
    return (
      <div className={`map_series_container ${isFreezetime ? "show" : "hide"}`}>
        <div className="map_series_container__header">
          <div className="mapes map_series_container__header--item ">MAP</div>
          <div className="picked map_series_container__header--item ">
            PICKED
          </div>
          <div className="winner map_series_container__header--item ">
            WINNER
          </div>
          <div className="score map_series_container__header--item ">SCORE</div>
        </div>
        {match.vetos
          .filter((veto) => veto.type !== "ban")
          .map((veto) => {
            if (!veto.mapName) return null;
            return (
              <VetoEntry
                veto={veto}
                teams={teams}
                active={map.name.includes(veto.mapName)}
              />
            );
          })}
      </div>
    );
  }
}
