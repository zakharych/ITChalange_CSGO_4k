import React from 'react';
import { Team } from 'csgogsi';
import TeamLogo from './TeamLogo';

export default class WinAnnouncement extends React.Component<{ team: Team | null, show: boolean }> {
    render() {
        const { team, show } = this.props;
        if(!team) return null;
        return <div className={`win_text ${show ? 'show' : 'hide'} ${team.orientation} ${team.side}`}>{team.name} WINS THE ROUND!
             
            </div>
    }
}
