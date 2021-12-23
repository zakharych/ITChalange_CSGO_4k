import React from 'react';
import "./firepower.css";

class LossBox extends React.PureComponent<{ active: boolean, side: 'CT' | 'T' }>{
    render(){
        return <div className={`loss-box ${this.props.side} ${this.props.active ? 'active':''}`}></div>
    }
}

interface Props {
    side: 'left' | 'right' ,
    team: 'CT' | 'T',
    equipment: number,
    LeftEquipment:number,
    RightEquipment:number,
    show: boolean,
    
}

export default class Money extends React.PureComponent<Props> {
	render() {
		return (
			<div className={`Firepower ${this.props.side} ${this.props.team} ${this.props.show ? "show" : "hide"}`}>
                <div className="money_container">
                    <div className="title">
                    <div className="LeftEquipment">${this.props.LeftEquipment}</div>
                    <div className="name">FIREPOWER</div>
                    <div className="RightEquipment">${this.props.RightEquipment}</div>
                    </div>
                  <div className={`valueLEFT ${this.props.team} `  } style={{ width: `${this.props.equipment}%`}}></div>
                  <div className={`valueRIGHT ${this.props.team} `}></div>
                </div>
            </div>
		);
	}

}
