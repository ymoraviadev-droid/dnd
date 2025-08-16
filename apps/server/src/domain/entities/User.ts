import { RegisterBody } from "@dnd/zod-schemas";

export class User {
    constructor(public props: RegisterBody) { }

    get email() {
        return this.props.email;
    }

    get password() {
        return this.props.password;
    }

    get name() {
        return this.props.name;
    }
}
