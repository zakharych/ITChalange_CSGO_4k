import React from "react";
import { PhaseRaw } from "csgogsi-socket";

interface IProps {
    phase: PhaseRaw | null
}

export default class Pause extends React.Component<IProps> {
    render() {
        const { phase } = this.props;
        return (
            <div id={`pause`} className={phase && phase.phase === "paused" ? 'show' : ''}>
                
                <div className="pause_name"> MATCH PAUSED </div>
            <div className="pause_icon">
            </div>
            </div>
            
        );
    }
}
