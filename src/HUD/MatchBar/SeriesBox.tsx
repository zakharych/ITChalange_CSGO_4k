import React from "react";
import * as I from "csgogsi-socket";
import "./../Styles/series.css";
import { Match } from "../../api/interfaces";

interface Props {
  map: I.Map;
  phase: I.PhaseRaw;
  match: Match | null;
}

export default class SeriesBox extends React.Component<Props> {
  render() {
    const { match, map } = this.props;

    const amountOfMaps =
      (match && Math.floor(Number(match.matchType.substr(-1)) / 2) + 1) || 0;
    const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
    const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
    return (
      <div id="series_container">
        <div id="encapsulator">
          <div className="container left">
            <div className={`series_wins left `}>
              <div className={`wins_box_container`}>
                {new Array(amountOfMaps).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className={`wins_box ${
                      left.matches_won_this_series > i ? "win" : ""
                    } ${left.side}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="container right">
            <div className={`series_wins right `}>
              <div className={`wins_box_container`}>
                {new Array(amountOfMaps).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className={`wins_box ${
                      right.matches_won_this_series > i ? "win" : ""
                    } ${right.side}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function SeriesInfo(props) {
  const { match, map } = props;
  const bo = (match && Number(match.matchType.substr(-1))) || 0;
  const mapName = map.name
    .substring(map.name.lastIndexOf("/") + 1)
    .split("_")[1]
    .toUpperCase();

  return (
    <div className="seriesMap">
      <div className="seriesMap_series">{bo ? `BEST OF ${bo}` : ""}</div>
      <div className="seriesMap_map">{mapName ? mapName : ""}</div>
    </div>
  );
}

export function OrganizerLogo() {
  return (
    <div className="organizerLogo">
      <div className={`tournament_image`}></div>
    </div>
  );
}
