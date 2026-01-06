export class MotorOutput {
  constructor(state) { this.state = state; }
  act() {
    if(this.state.attended && this.state.attended.length > 0) {
      this.state.actions = this.state.attended.map(stim => `Action_for_${stim}`);
    } else {
      this.state.actions = [];
    }
  }
}
