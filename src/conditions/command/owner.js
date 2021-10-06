import {Precondition, PreconditionResult} from "patron";
import {sensitive} from "../../services/data.js";

export default new class Owner extends Precondition {
  constructor() {
    super({name: "Owner"});
  }
  run(cmd, msg) {
    if(sensitive.owner.includes(msg.author.id))
      return PreconditionResult.fromSuccess();

    return PreconditionResult.fromFailure(cmd, "This command may only be used by my owner.");
  }
}();
