import React from 'react';
import './trivia.scss';

import {configs, actions} from './../../App';

export default class Trivia extends React.Component<any, { title: string, content: string, show: boolean }> {
	constructor(props: any) {
		super(props);
		this.state = {
            title:'Title',
            content:'Content',
            show: false
		}
	}

	componentDidMount() {
        configs.onChange((data:any) => {
            if(!data) return;
            const trivia = data.trivia;
            if(!trivia) return;

            if(trivia.title){
                this.setState({title:trivia.title})
            }
        });
        actions.on("triviaState", (state: any) => {
            this.setState({show: state === "show"})
        });
        actions.on("toggleTrivia", () => {
            this.setState({show: !this.state.show})
        });
	}
	
	render() {
		return (
			<div className={`trivia_container`}>
                <div className="title">{this.state.title}</div>
            </div>
		);
	}

}
