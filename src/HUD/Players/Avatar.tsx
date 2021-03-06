import React from "react";
// import { isDev, port } from '../../api/api';
import { actions } from "../../App";
import { avatars } from "./../../api/avatars";
import { Avatarka, Skull } from "./../../assets/Icons";

interface IProps {
  steamid: string;
  slot?: number;
  height?: string | number | undefined;
  width?: string | number | undefined;
  showSkull?: boolean;
  showCam?: boolean;
}
interface IState {
  enableCams: boolean;
}
export default class Avatar extends React.Component<IProps, IState> {
  state = {
    enableCams: !!this.props.showCam,
  };
  componentDidMount() {
    actions.on("toggleCams", () => {
      this.setState({ enableCams: !this.state.enableCams });
    });
  }
  render() {
    // const { enableCams } = this.state;
    //const url = avatars.filter(avatar => avatar.steamid === this.props.steamid)[0];
    const avatarData = avatars[this.props.steamid];
    if (!Avatarka && !avatarData.url.length) {
      return "";
    }
    // const slot = this.props.slot === 0 ? 10 : this.props.slot || 1;
    // const leftPosition = - 150*((slot-1)%5);
    // const topPosition = slot > 5 ? -150 : 0;
    return (
      <div className={`player__avatar`}>
        {this.props.showSkull ? (
          <Skull height={this.props.height} width={this.props.width} />
        ) : (
          <img
            src={avatarData.url || Avatarka}
            height={this.props.height ? this.props.height : "100%"}
            width={this.props.width ? this.props.width : "100%"}
            alt={"Avatar"}
          />
        )}
      </div>
    );
  }
}
