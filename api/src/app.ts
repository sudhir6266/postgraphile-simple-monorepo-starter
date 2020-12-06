import express, {Application} from "express";
import middlewares from "./middleware";

class App {
    public app: Application;

    constructor(
    ) {
        this.app = express();
        this.configureMiddleware();
    }

    private configureMiddleware(): void {
        for (const middleware of middlewares) {
            this.app.use(middleware);
        }
    }
}

export default new App().app;
