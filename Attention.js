export class Attention {
    constructor() {
        this.focus = 0;
    }

    increase(amount = 1) {
        this.focus += amount;
    }

    reset() {
        this.focus = 0;
    }
}
