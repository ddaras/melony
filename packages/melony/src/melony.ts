import { Runtime } from "./runtime";
import { Config } from "./types";


export const melony = <TState = any>(config: Config<TState>) => {
    const runtime = new Runtime<TState>(config);
    return {
        config,
        run: runtime.run.bind(runtime),
    };
};